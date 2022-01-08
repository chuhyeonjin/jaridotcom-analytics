import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as nacl from 'tweetnacl';
import { interaction, interactionType } from './types/interaction';
import { interactionResponse, interactionResponseType } from './types/interactionResponse';
import { cloudflareAnalytics, cloudflareApi } from './cloudflareApi';
import { formatBytes } from './utils';

const allowUsers = process.env['ALLOW_USERS'].split(',');
const api = new cloudflareApi(
  {
    email: process.env['CLOUDFLARE_API_EMAIL'],
    token: process.env['CLOUDFLARE_API_KEY'],
  },
  process.env['CLOUDFLARE_ZONE_ID']
);

const discord: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!verifyRequest(req)) {
    context.res.status(401);
    context.res.end('invalid request signature');
    return;
  }

  const body: interaction = req.body;

  const type = body.type;

  switch (type) {
    case interactionType.PING:
      context.res.json({ type: 1 });
      break;
    case interactionType.APPLICATION_COMMAND:
      await handleCommand(context, body);
      return;
    default:
      break;
  }
};

function verifyRequest(req: HttpRequest): boolean {
  const PUBLIC_KEY = process.env['DISCORD_PUBLIC_KEY'];

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = req.rawBody;

  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(PUBLIC_KEY, 'hex')
    );
  } catch {
    return false;
  }
}

async function handleCommand(context: Context, req: interaction) {
  if (!allowUsers.includes(req.member.user.id)) return;

  switch (req.data.name) {
    case 'analytics':
      let analytics: cloudflareAnalytics;
      switch (req.data.options[0].value) {
        case '1d':
          analytics = await api.get1DayAnalytics();
          break;
        case '7d':
          analytics = await api.get7DayAnalytics();
          break;
        case '1m':
          analytics = await api.get1MonthAnalytics();
          break;
      }

      const sinceDateString = analytics.since.toLocaleDateString('ko-kr');
      const untilDateString = analytics.until.toLocaleDateString('ko-kr');

      const response: interactionResponse = {
        type: interactionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: '자리닷컴 클라우드 플레어 통계',
              description: `${sinceDateString} ~ ${untilDateString}`,
              color: 0x1e1e1e,
              fields: [
                {
                  name: '고유 방문자',
                  value: `${analytics.uniqueVisitor.toLocaleString('ko-kr')} 명`,
                },
                {
                  name: '전송된 바이트',
                  value: formatBytes(analytics.totalByte),
                },
                {
                  name: '캐시된 바이트',
                  value: formatBytes(analytics.totalCachedByte),
                },
                {
                  name: '총 요청',
                  value: `${analytics.totalRequest.toLocaleString('ko-kr')} 회`,
                },
                {
                  name: '캐시된 비율',
                  value: `${(analytics.cacheRatio * 100).toFixed(3)}%`,
                },
              ],
            },
          ],
          flags: req.data.options[1]?.value ? undefined : 64,
        },
      };

      context.res.json(response);
      break;
    default:
      break;
  }
}

export default discord;
