export const clientIdPropertyDescriptionDoc = `\
Required. Client ID number is a unique identifier for a browser–device \
pair that helps Google Analytics 4 link user actions on a site / app. By default, \
Google Analytics 4 determines unique users using this parameter.

When Google Analytics is connected using GTAG or Google Tag Manager, a client ID \
is generated and sent automatically. Since we have a non-standart case, we \
should manually generate an id that will emulate this parameter.

The client_id must be constant for each client (user).`;

export const userIdPropertyDescriptionDoc = `\
Optional. A unique identifier for user.

This parameter lets you associate your own identifiers with individual users to \
link them across different sessions (different devices, platforms). Also, useful \
in the case where we have multiple data streams in application (for example, \
Telegram Bot and Telegram Web App), this way we can associate the behavior of \
the same user in these streams.

If your client_id is constant for user across all sessions and data streams, \
this parameter is unnecessary.

More information: [User-ID for cross-platform analysis](https://support.google.com/analytics/answer/9213390).`;

export const engagementsTimePropertyDescriptionDoc = `\
Optional. Parameter should reflect the event's engagement time in milliseconds.

User engagement is the amount of time someone spends with your web page in focus \
or app screen in the foreground, which allows you to measure when users actively \
use your site or app.

Default value: \`100\`ms`;

export const pageTitlePropertyDescriptionDoc = `\
Optional. The title of the page. In the case of Telegram Bot, name of command \
can be passed.`;

export const requiredPageTitlePropertyDescriptionDoc = `\
Required. The title of the page. In the case of Telegram Bot, name of command \
should be passed.`;

export const pageReferrerPropertyDescriptionDoc = `\
Optional. The referring URL, which is the user's previous URL and can be your \
website's domain or other domains.`;

export const languagePropertyDescriptionOdc = `\
Optional. IETF language tag. 

Required to collect statistics for this parameter. Can be omitted.`;

export const mediumPropertyDescriptionDoc = `\
Optional. The campaign medium.

Can be system-defined: 
- \`organic\`
- \`cpc\`
- \`referral\`
- \`email\`
- \`affiliate\`
- \`(none)\`

Or user-defined which are support any custom value.

Default value: \`(none)\``;

export const sourcePropertyDescriptionDoc = `\
Optional. The campaign traffic source (e.g. google, email, etc.).

Usually the root domain name of the traffic source website or any keyword. \
In case of the domain name, it should match the \`page_referrer\` parameter.

Default value: \`Direct\` which means no traffic source.`;
