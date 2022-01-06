# 자리닷컴 클라우드플레어 통계봇

[자리닷컴](https://자리.com)의 클라우드플레어 통계를 쉽게 보기 위해 만든 봇!

[Azure Functions](https://azure.microsoft.com/en-us/services/functions) 에서 돌아갑니다.

## 기능
- 1일/7일/1달 단위로 고유 방문자/전송된 바이트/캐시된 바이트/총 요청/캐시 비율을 알려줌
- 서버리스

## [설정](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal#settings)
- ALLOW-USERS - 봇을 쓸수 있는 유저 아이디를 `,`로 구분해 적습니다. (예: `123,124,524`)
- CLOUDFLARE_API_EMAIL - 클라우드 플레어 계정 이메일을 적습니다. (예: `a@example.com`)
- CLOUDFLARE_API_KEY - 클라우드 플레어에서 발급한 API 토큰을 적습니다.
- CLOUDFLARE_ZONE_ID - 통계를 조회할 존의 아이디를 적습니다.
- DISCORD_PUBLIC_KEY - 봇의 인터렉션 엔드포인트용 퍼블릭 키를 적습니다.
