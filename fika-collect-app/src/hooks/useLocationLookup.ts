import { useEffect, useState } from 'react';
import * as RNFS from '@dr.pogodin/react-native-fs';

let parsedLocations: object | null = null;

function useLocationLookup(): {
  locations: object | null;
  error: string | null;
} {
  const [locations, setLocations] = useState<object | null>(parsedLocations);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locations || error) {
      return;
    }
    const loadLocations = async () => {
      console.log('Loading locations.json');
      try {
        // On iOS, RNFS.MainBundlePath is correct. On Android, assets are accessed differently.
        let path: string;
        if (RNFS.MainBundlePath) {
          // iOS
          path = `${RNFS.MainBundlePath}/locations.json`;
          const fileContent = await RNFS.readFile(path, 'utf8');
          setLocations(JSON.parse(fileContent));
        } else {
          // Android: use readFileAssets to access bundled assets
          const fileContent = await RNFS.readFileAssets('custom/locations.json', 'utf8');
          setLocations(JSON.parse(fileContent));
        }
      } catch (err) {
        console.error('Error reading locations.json:', err);
        setError('Failed to load locations');
      }
    };
    loadLocations();
  }, [locations, error]);

  return { locations, error };
}

export { useLocationLookup };