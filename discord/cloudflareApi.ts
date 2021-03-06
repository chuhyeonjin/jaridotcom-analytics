import { gql, GraphQLClient } from 'graphql-request';
import { getUTCISODateString, getUTCISODateTimeString } from './utils';

const analyticsApiEndpoint = 'https://api.cloudflare.com/client/v4/graphql';

export interface cloudflareApiAuthInfo {
  email: string;
  token: string;
}

export interface cloudflareAnalytics {
  uniqueVisitor: number;
  totalRequest: number;
  totalByte: number; // byte
  totalCachedByte: number; // byte
  cacheRatio: number;
  since: Date;
  until: Date;
}

const zoneAnalyticsForShortTime = gql`
  query getZoneAnalyticsForShortTime($zoneTag: String!, $since: String!, $until: String!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        httpRequests1hGroups(limit: 10000, filter: { datetime_geq: $since, datetime_lt: $until }) {
          uniq {
            uniques
          }
          sum {
            requests
            bytes
            cachedBytes
          }
        }
      }
    }
  }
`;

const zoneAnalyticsForLongTime = gql`
  query getZoneAnalyticsForLongTime($zoneTag: String!, $since: String!, $until: String!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        httpRequests1dGroups(limit: 10000, filter: { date_geq: $since, date_lt: $until }) {
          uniq {
            uniques
          }
          sum {
            requests
            bytes
            cachedBytes
          }
        }
      }
    }
  }
`;

export class cloudflareApi {
  private readonly graphqlClient: GraphQLClient;
  private readonly zoneId: string;

  public constructor(authInfo: cloudflareApiAuthInfo, zoneId: string) {
    this.zoneId = zoneId;
    this.graphqlClient = new GraphQLClient(analyticsApiEndpoint, {
      headers: { Authorization: 'Bearer ' + authInfo.token, 'X-Auth-Email': authInfo.email },
    });
  }

  private static responseToAnalytics(body: any, sinceDate: Date, untilDate: Date): cloudflareAnalytics {
    return {
      cacheRatio: body.sum.cachedBytes / body.sum.bytes,
      totalByte: body.sum.bytes,
      totalCachedByte: body.sum.cachedBytes,
      totalRequest: body.sum.requests,
      uniqueVisitor: body.uniq.uniques,
      since: sinceDate,
      until: untilDate,
    };
  }

  public async get1DayAnalytics(): Promise<cloudflareAnalytics> {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 1);
    const until = new Date();

    const result = await this.graphqlClient.request(zoneAnalyticsForShortTime, {
      zoneTag: this.zoneId,
      since: getUTCISODateTimeString(since),
      until: getUTCISODateTimeString(until),
    });

    const body = result.viewer.zones[0].httpRequests1hGroups[0];

    return cloudflareApi.responseToAnalytics(body, since, until);
  }

  public async get7DayAnalytics(): Promise<cloudflareAnalytics> {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 7);
    const until = new Date();

    const result = await this.graphqlClient.request(zoneAnalyticsForLongTime, {
      zoneTag: this.zoneId,
      since: getUTCISODateString(since),
      until: getUTCISODateString(until),
    });

    const body = result.viewer.zones[0].httpRequests1dGroups[0];

    return cloudflareApi.responseToAnalytics(body, since, until);
  }

  public async get1MonthAnalytics(): Promise<cloudflareAnalytics> {
    const since = new Date();
    since.setUTCMonth(since.getUTCMonth() - 1);
    const until = new Date();

    const result = await this.graphqlClient.request(zoneAnalyticsForLongTime, {
      zoneTag: this.zoneId,
      since: getUTCISODateString(since),
      until: getUTCISODateString(until),
    });

    const body = result.viewer.zones[0].httpRequests1dGroups[0];

    return cloudflareApi.responseToAnalytics(body, since, until);
  }
}
