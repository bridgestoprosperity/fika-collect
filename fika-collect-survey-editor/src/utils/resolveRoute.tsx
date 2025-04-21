import React from 'react';
import SurveyList from '../components/SurveyList';

type RouteList = {
  [key: string]: React.ComponentType<any>;
};

export default function createResolver(routes: RouteList) {
  return function resolveRoute(hash: string | null) {
    if (!hash) return {Component: SurveyList, props: {}};

    for (const route in routes) {
      const paramMatch = route.match(/:([^/]+)/);
      if (paramMatch) {
        const regex = new RegExp(route.replace(/:([^/]+)/, '([^/]+)'));
        const match = hash.match(regex);
        if (match) {
          const paramName = paramMatch[1];
          return {
            Component: routes[route as keyof typeof routes],
            props: {[paramName]: match[1]},
          };
        }
      } else if (route === hash) {
        return {Component: routes[route], props: {}};
      }
    }

    return {Component: SurveyList, props: {}};
  };
}
