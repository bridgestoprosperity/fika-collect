import json
import requests
import boto3
from typing import Dict, Any, List
import struct
import io

# Salesforce credentials
consumer_key = False
consumer_secret = False
grant = "client_credentials"
url_host = "https://bridges.my.salesforce.com"
url_auth = url_host + "/services/oauth2/token"

# Initialize S3 client
s3_client = boto3.client("s3")


def get_response_value(responses: List[Dict], question_id: str) -> Any:
    """Extract value from survey responses by question_id"""
    for response in responses:
        if response.get("question_id") == question_id:
            return response.get("value")
    return None


def get_gps_from_image(bucket: str, image_filename: str) -> tuple:
    """Extract GPS coordinates from image EXIF data using basic parsing"""
    if not image_filename:
        return None, None
    
    try:
        # Read image from S3
        response = s3_client.get_object(Bucket=bucket, Key=image_filename)
        image_data = response['Body'].read()
        
        # Look for EXIF data in JPEG
        if image_data[:2] != b'\xff\xd8':  # Not a JPEG
            return None, None
            
        # Find EXIF segment
        pos = 2
        while pos < len(image_data) - 1:
            if image_data[pos:pos+2] == b'\xff\xe1':  # EXIF marker
                # Get EXIF data length
                exif_length = struct.unpack('>H', image_data[pos+2:pos+4])[0]
                exif_data = image_data[pos+4:pos+2+exif_length]
                
                # Check for EXIF header
                if exif_data[:4] == b'Exif':
                    return parse_exif_gps(exif_data[6:])  # Skip "Exif\x00\x00"
                break
            elif image_data[pos:pos+2] == b'\xff\xda':  # Start of scan data
                break
            else:
                # Skip to next marker
                if image_data[pos] == 0xff:
                    marker_length = struct.unpack('>H', image_data[pos+2:pos+4])[0]
                    pos += 2 + marker_length
                else:
                    pos += 1
        
        return None, None
        
    except Exception as e:
        print(f"Error extracting GPS from image {image_filename}: {str(e)}")
        return None, None


def parse_exif_gps(exif_data):
    """Parse GPS data from EXIF using basic struct parsing"""
    try:
        # Check byte order
        if exif_data[:2] == b'II':  # Little endian
            endian = '<'
        elif exif_data[:2] == b'MM':  # Big endian
            endian = '>'
        else:
            return None, None
            
        # Skip to IFD0
        ifd_offset = struct.unpack(endian + 'I', exif_data[4:8])[0]
        
        # Look for GPS IFD
        gps_ifd_offset = find_gps_ifd(exif_data, ifd_offset, endian)
        if not gps_ifd_offset:
            return None, None
            
        # Parse GPS data
        return parse_gps_ifd(exif_data, gps_ifd_offset, endian)
        
    except Exception:
        return None, None


def find_gps_ifd(data, ifd_offset, endian):
    """Find GPS IFD offset"""
    try:
        if ifd_offset >= len(data) - 2:
            return None
            
        entry_count = struct.unpack(endian + 'H', data[ifd_offset:ifd_offset+2])[0]
        
        for i in range(entry_count):
            entry_offset = ifd_offset + 2 + (i * 12)
            if entry_offset + 12 > len(data):
                continue
                
            tag = struct.unpack(endian + 'H', data[entry_offset:entry_offset+2])[0]
            if tag == 0x8825:  # GPS IFD tag
                gps_offset = struct.unpack(endian + 'I', data[entry_offset+8:entry_offset+12])[0]
                return gps_offset
                
        return None
    except Exception:
        return None


def parse_gps_ifd(data, gps_offset, endian):
    """Parse GPS IFD to extract lat/lon"""
    try:
        if gps_offset >= len(data) - 2:
            return None, None
            
        entry_count = struct.unpack(endian + 'H', data[gps_offset:gps_offset+2])[0]
        
        lat_data = None
        lat_ref = None
        lon_data = None
        lon_ref = None
        
        for i in range(entry_count):
            entry_offset = gps_offset + 2 + (i * 12)
            if entry_offset + 12 > len(data):
                continue
                
            tag = struct.unpack(endian + 'H', data[entry_offset:entry_offset+2])[0]
            data_type = struct.unpack(endian + 'H', data[entry_offset+2:entry_offset+4])[0]
            count = struct.unpack(endian + 'I', data[entry_offset+4:entry_offset+8])[0]
            value_offset = struct.unpack(endian + 'I', data[entry_offset+8:entry_offset+12])[0]
            
            if tag == 1:  # GPSLatitudeRef
                lat_ref = chr(data[entry_offset+8]) if count == 1 else None
            elif tag == 2:  # GPSLatitude
                lat_data = parse_rational_array(data, value_offset, endian, count)
            elif tag == 3:  # GPSLongitudeRef  
                lon_ref = chr(data[entry_offset+8]) if count == 1 else None
            elif tag == 4:  # GPSLongitude
                lon_data = parse_rational_array(data, value_offset, endian, count)
        
        if lat_data and lon_data and len(lat_data) >= 3 and len(lon_data) >= 3:
            # Convert to decimal degrees
            latitude = lat_data[0] + lat_data[1]/60 + lat_data[2]/3600
            longitude = lon_data[0] + lon_data[1]/60 + lon_data[2]/3600
            
            if lat_ref == 'S':
                latitude = -latitude
            if lon_ref == 'W':
                longitude = -longitude
                
            return latitude, longitude
            
        return None, None
        
    except Exception:
        return None, None


def parse_rational_array(data, offset, endian, count):
    """Parse array of rational numbers"""
    try:
        if offset >= len(data):
            return []
            
        rationals = []
        for i in range(count):
            rat_offset = offset + (i * 8)
            if rat_offset + 8 > len(data):
                break
                
            numerator = struct.unpack(endian + 'I', data[rat_offset:rat_offset+4])[0]
            denominator = struct.unpack(endian + 'I', data[rat_offset+4:rat_offset+8])[0]
            
            if denominator != 0:
                rationals.append(numerator / denominator)
            else:
                rationals.append(0)
                
        return rationals
    except Exception:
        return []


def map_survey_to_salesforce(survey_data: Dict, bucket: str) -> Dict:
    """Map survey data to Salesforce payload format"""
    responses = survey_data.get("responses", [])

    # Extract admin location hierarchy - now it's a direct array
    admin_location = get_response_value(responses, "admin_location")

    # Handle both old format (object with selection) and new format (direct array)
    if isinstance(admin_location, dict):
        # Old format: {'selection': [...]}
        selection = admin_location.get("selection", [])
    elif isinstance(admin_location, list):
        # New format: direct array
        selection = admin_location
    else:
        selection = []

    # Pad selection array to ensure we have enough elements
    selection_padded = selection + [""] * (6 - len(selection))

    # Extract GPS coordinates
    location = get_response_value(responses, "location")
    if isinstance(location, dict):
        latitude = location.get("latitude")
        longitude = location.get("longitude")
    else:
        latitude = None
        longitude = None

    # Handle multi-select fields by joining with semicolons (Salesforce multi-picklist format)
    transportation_modes = get_response_value(responses, "transportation_modes")
    education_destinations = get_response_value(responses, "education_destinations")
    health_destinations = get_response_value(responses, "health_destinations")
    economic_destinations = get_response_value(
        responses, "economic_desinations"
    )  # Note: typo in original
    social_destinations = get_response_value(responses, "social_destinations")
    current_methods = get_response_value(responses, "current_method")

    # Get deaths value directly as number
    deaths = get_response_value(responses, "deaths")

    # Convert width to integer
    width_raw = get_response_value(responses, "width")
    width = int(width_raw) if width_raw else None

    # Check if any response contains "test" (case-insensitive)
    is_test = False
    for response in responses:
        value = response.get("value")
        if value is not None:
            # Convert value to string and check for "test"
            value_str = str(value).lower()
            if "test" in value_str:
                is_test = True
                break

    # Extract GPS coordinates from photo metadata
    photo_filename = get_response_value(responses, "photo_of_crossing")
    image_latitude, image_longitude = get_gps_from_image(bucket, photo_filename)

    # Construct full S3 URL for the image
    image_url = None
    if photo_filename:
        # Extract survey ID from survey_data
        survey_id = survey_data.get("id")
        # Construct the full S3 URL
        # Format: https://{bucket}.s3.{region}.amazonaws.com/responses/bridge_request/{survey_id}/{filename}
        image_url = f"https://{bucket}.s3.us-west-1.amazonaws.com/responses/bridge_request/{survey_id}/{photo_filename}"

    payload = {
        "Status__c": "New",
        "RecordTypeId": "012Ns00000TBCbRIAX",
        "External_Id__c": survey_data.get("id"),
        "Test__c": is_test,
        "Phone_Number__c": get_response_value(responses, "phone_number"),
        "Country__c": selection_padded[2] if len(selection_padded) > 2 else None,
        "Level_1_Government__c": (
            selection_padded[3] if len(selection_padded) > 3 else None
        ),
        "Level_2_Government__c": (
            selection_padded[4] if len(selection_padded) > 4 else None
        ),
        "Level_3_Government__c": (
            selection_padded[5] if len(selection_padded) > 5 else None
        ),
        "Closest_Community__c": get_response_value(responses, "closest_community"),
        "River_Name__c": get_response_value(responses, "river_name"),
        "GPS__latitude__s": latitude,
        "GPS__longitude__s": longitude,
        "Community_on_opposite_side_of_crossing__c": get_response_value(
            responses, "closest_community_opposite"
        ),
        "Modes_of_Transportation_Used__c": (
            ";".join(transportation_modes) if transportation_modes else None
        ),
        "Education_Destinations__c": (
            ";".join(education_destinations) if education_destinations else None
        ),
        "Health_Facilities_Visited__c": (
            ";".join(health_destinations) if health_destinations else None
        ),
        "Economic_Facilities_Visited__c": (
            ";".join(economic_destinations) if economic_destinations else None
        ),
        "Social_Facilities_Visited__c": (
            ";".join(social_destinations) if social_destinations else None
        ),
        "Other_Destinations__c": get_response_value(
            responses, "additional_destinations"
        ),
        "Duration_to_Cross_During_Flooding__c": get_response_value(
            responses, "detour_duration"
        ),
        "Deaths_over_the_Last_3_Years__c": deaths,
        "Current_Crossing_Method__c": (
            ";".join(current_methods) if current_methods else None
        ),
        "Obstacle_Blocking_Path_Road__c": get_response_value(responses, "blocking"),
        "Width_of_River_During_Flooding_m__c": width,
        "Other_Information__c": get_response_value(responses, "other_information"),
        "Image_Url__c": image_url,
        "Image_GPS__latitude__s": image_latitude,
        "Image_GPS__longitude__s": image_longitude,
    }

    # Remove None values to avoid Salesforce errors
    return {k: v for k, v in payload.items() if v is not None}


def get_salesforce_token() -> str:
    """Authenticate with Salesforce and return access token"""
    payload_auth = {
        "grant_type": grant,
        "client_id": consumer_key,
        "client_secret": consumer_secret,
    }

    res = requests.post(
        url_auth,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data=payload_auth,
    )

    if res.status_code != 200:
        raise Exception(f"Salesforce authentication failed: {res.content}")

    res_auth = json.loads(res.content)
    return res_auth["access_token"]


def create_salesforce_record(token: str, payload: Dict) -> Dict:
    """Create a record in Salesforce"""
    url_update = url_host + "/services/data/v61.0/sobjects/Fika_Collect_Survey__c"
    payload_json = json.dumps(payload)

    response = requests.post(
        url_update,
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        data=payload_json,
    )

    return {
        "status_code": response.status_code,
        "content": response.content.decode("utf-8"),
        "success": response.status_code in [200, 201],
    }


def lambda_handler(event, context):
    """
    Lambda handler that processes survey data from S3 and creates Salesforce records

    Event should contain:
    - bucket: S3 bucket name
    - key: S3 object key (file path)

    Or can be triggered by S3 event
    """

    try:
        # Handle S3 event trigger or direct invocation
        if "Records" in event:
            # S3 event trigger
            bucket = event["Records"][0]["s3"]["bucket"]["name"]
            key = event["Records"][0]["s3"]["object"]["key"]
        else:
            # Direct invocation
            bucket = event.get("bucket")
            key = event.get("key")

        if not bucket or not key:
            return {
                "statusCode": 400,
                "body": json.dumps("Missing bucket or key parameter"),
            }

        print(f"Processing file: s3://{bucket}/{key}")

        # Read survey data from S3
        try:
            response = s3_client.get_object(Bucket=bucket, Key=key)
            survey_data = json.loads(response["Body"].read())
        except Exception as e:
            print(f"Error reading from S3: {str(e)}")
            return {
                "statusCode": 500,
                "body": json.dumps(f"Error reading survey data: {str(e)}"),
            }

        # Get Salesforce token
        try:
            token = get_salesforce_token()
            print("Successfully authenticated with Salesforce")
        except Exception as e:
            print(f"Salesforce authentication error: {str(e)}")
            return {
                "statusCode": 500,
                "body": json.dumps(f"Salesforce authentication failed: {str(e)}"),
            }

        # Map survey data to Salesforce format
        try:
            salesforce_payload = map_survey_to_salesforce(survey_data, bucket)
            print(f"Mapped survey data: {json.dumps(salesforce_payload, indent=2)}")
        except Exception as e:
            print(f"Error mapping survey data: {str(e)}")
            return {
                "statusCode": 500,
                "body": json.dumps(f"Error mapping survey data: {str(e)}"),
            }

        # Create Salesforce record
        try:
            sf_result = create_salesforce_record(token, salesforce_payload)
            print(f"Salesforce result: {sf_result}")

            if sf_result["success"]:
                return {
                    "statusCode": 200,
                    "body": json.dumps(
                        {
                            "message": "Survey processed successfully",
                            "survey_id": survey_data.get("id"),
                            "salesforce_response": sf_result["content"],
                        }
                    ),
                }
            else:
                return {
                    "statusCode": 500,
                    "body": json.dumps(
                        {
                            "message": "Failed to create Salesforce record",
                            "error": sf_result["content"],
                        }
                    ),
                }

        except Exception as e:
            print(f"Error creating Salesforce record: {str(e)}")
            return {
                "statusCode": 500,
                "body": json.dumps(f"Error creating Salesforce record: {str(e)}"),
            }

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"statusCode": 500, "body": json.dumps(f"Unexpected error: {str(e)}")}