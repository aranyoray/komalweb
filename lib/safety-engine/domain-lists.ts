// ============================================================================
// Domain Lists & URL Classification
// Extracted from app/api/scan-url/route.ts
// ============================================================================

import type { DangerousSiteInfo } from './types';

// ============================================================================
// SOCIAL MEDIA SITES - Special handling (BLOCK for <13, score 20-30 for 13+)
// ============================================================================
export const SOCIAL_MEDIA_DOMAINS = new Set([
  // Major social networks
  'facebook.com', 'www.facebook.com', 'm.facebook.com',
  'instagram.com', 'www.instagram.com',
  'twitter.com', 'www.twitter.com', 'x.com', 'www.x.com',
  'tiktok.com', 'www.tiktok.com', 'm.tiktok.com',
  'snapchat.com', 'www.snapchat.com',
  'linkedin.com', 'www.linkedin.com',
  'pinterest.com', 'www.pinterest.com',
  'reddit.com', 'www.reddit.com', 'old.reddit.com',
  'tumblr.com', 'www.tumblr.com',
  'discord.com', 'www.discord.com', 'discord.gg',

  // Messaging apps with social features
  'whatsapp.com', 'www.whatsapp.com', 'web.whatsapp.com',
  'telegram.org', 'www.telegram.org', 't.me', 'web.telegram.org',
  'messenger.com', 'www.messenger.com',
  'signal.org', 'www.signal.org',

  // Video/streaming social platforms
  'youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be',
  'twitch.tv', 'www.twitch.tv',
  'kick.com', 'www.kick.com',

  // Other social platforms
  'threads.net', 'www.threads.net',
  'mastodon.social', 'mastodon.online',
  'bsky.app', 'bsky.social',
  'truth social', 'truthsocial.com',
  'quora.com', 'www.quora.com',
  'meetup.com', 'www.meetup.com',
  'nextdoor.com', 'www.nextdoor.com',
  'clubhouse.com', 'www.clubhouse.com',
  'bereal.com', 'www.bereal.com',
  'lemon8-app.com', 'www.lemon8-app.com',

  // Dating apps (social category)
  'tinder.com', 'www.tinder.com',
  'bumble.com', 'www.bumble.com',
  'hinge.co', 'www.hinge.co',
  'match.com', 'www.match.com',
  'okcupid.com', 'www.okcupid.com',

  // Regional social networks
  'weibo.com', 'www.weibo.com',
  'vk.com', 'www.vk.com',
  'line.me', 'www.line.me',
  'kakaotalk.com', 'www.kakaotalk.com',
  'wechat.com', 'www.wechat.com',
]);

// ============================================================================
// DANGEROUS SITES - BLOCK FOR ALL AGE GROUPS (Score 0)
// ============================================================================
export const DANGEROUS_BLOCKED_DOMAINS = new Set([
  // === PORNOGRAPHIC WEBSITES ===
  'pornhub.com', 'www.pornhub.com',
  '8tube.xxx', 'www.8tube.xxx',
  'redtube.com', 'www.redtube.com',
  'kink.com', 'www.kink.com',
  'youjizz.com', 'www.youjizz.com',
  'xvideos.com', 'www.xvideos.com',
  'youporn.com', 'www.youporn.com',
  'brazzers.com', 'www.brazzers.com',
  'xnxx.com', 'www.xnxx.com',
  'xhamster.com', 'www.xhamster.com',
  'pornhub.org', 'www.pornhub.org',
  'tube8.com', 'www.tube8.com',
  'spankbang.com', 'www.spankbang.com',
  'eporner.com', 'www.eporner.com',
  'tnaflix.com', 'www.tnaflix.com',
  'porn.com', 'www.porn.com',
  'hentaihaven.xxx', 'www.hentaihaven.xxx',
  'nhentai.net', 'www.nhentai.net',
  'rule34.xxx', 'www.rule34.xxx',
  'chaturbate.com', 'www.chaturbate.com',
  'onlyfans.com', 'www.onlyfans.com',
  'fansly.com', 'www.fansly.com',
  'stripchat.com', 'www.stripchat.com',
  'bongacams.com', 'www.bongacams.com',
  'livejasmin.com', 'www.livejasmin.com',
  'cam4.com', 'www.cam4.com',
  'myfreecams.com', 'www.myfreecams.com',

  // === DANGEROUS CHAT ROOMS ===
  'omegle.com', 'www.omegle.com',
  'paltalk.com', 'www.paltalk.com',
  'talkwithstranger.com', 'www.talkwithstranger.com',
  'chatroulette.com', 'www.chatroulette.com',
  'chat-avenue.com', 'www.chat-avenue.com',
  'chatango.com', 'www.chatango.com',
  'teenchat.com', 'www.teenchat.com',
  'wireclub.com', 'www.wireclub.com',
  'chathour.com', 'www.chathour.com',
  'chatzy.com', 'www.chatzy.com',
  'chatib.us', 'www.chatib.us',
  'e-chat.co', 'www.e-chat.co',
  'chatrandom.com', 'www.chatrandom.com',
  'camsurf.com', 'www.camsurf.com',
  'emeraldchat.com', 'www.emeraldchat.com',
  'shagle.com', 'www.shagle.com',
  'camsoda.com', 'www.camsoda.com',

  // === DANGEROUS FORUMS ===
  '4chan.org', 'www.4chan.org', 'boards.4chan.org',
  'somethingawful.com', 'www.somethingawful.com', 'forums.somethingawful.com',
  'topix.com', 'www.topix.com',
  'stormfront.org', 'www.stormfront.org',
  'kiwifarms.net', 'www.kiwifarms.net', 'kiwifarms.st',
  'voat.co', 'www.voat.co',
  '8kun.top', 'www.8kun.top', '8ch.net',
  'incels.me', 'www.incels.me', 'incels.is', 'incels.co',
  'lolcow.farm', 'www.lolcow.farm',
  'encyclopediadramatica.rs', 'www.encyclopediadramatica.rs',

  // === DATING WEBSITES (Adult-focused) ===
  'meetme.com', 'www.meetme.com',
  'pof.com', 'www.pof.com', 'plentyoffish.com',
  'eharmony.com', 'www.eharmony.com',
  'zoosk.com', 'www.zoosk.com',
  'grindr.com', 'www.grindr.com',
  'ashleymadison.com', 'www.ashleymadison.com',
  'adultfriendfinder.com', 'www.adultfriendfinder.com',
  'fling.com', 'www.fling.com',
  'benaughty.com', 'www.benaughty.com',
  'seeking.com', 'www.seeking.com', 'seekingarrangement.com',
  'fetlife.com', 'www.fetlife.com',

  // === ONLINE GAMBLING/BETTING ===
  'betonline.ag', 'www.betonline.ag',
  'freespin.com', 'www.freespin.com',
  'bovada.lv', 'www.bovada.lv',
  'slotocash.im', 'www.slotocash.im',
  'royalacecasino.com', 'www.royalacecasino.com',
  'pokerstars.com', 'www.pokerstars.com',
  '888casino.com', 'www.888casino.com',
  'sportsbetting.ag', 'www.sportsbetting.ag',
  'betway.com', 'www.betway.com',
  'bet365.com', 'www.bet365.com',
  'draftkings.com', 'www.draftkings.com',
  'fanduel.com', 'www.fanduel.com',
  'caesars.com', 'www.caesars.com',
  'betmgm.com', 'www.betmgm.com',
  'unibet.com', 'www.unibet.com',
  'williamhill.com', 'www.williamhill.com',
  'bwin.com', 'www.bwin.com',
  'stake.com', 'www.stake.com',
  'roobet.com', 'www.roobet.com',
  'casinodays.com', 'www.casinodays.com',

  // === VIOLENT/GRAPHIC CONTENT ===
  'liveleak.com', 'www.liveleak.com',
  'bestgore.com', 'www.bestgore.com',
  'theync.com', 'www.theync.com',
  'documentingreality.com', 'www.documentingreality.com',
  'ogrish.tv', 'www.ogrish.tv',
  'goregasm.com', 'www.goregasm.com',
  'shockchan.com', 'www.shockchan.com',
  'goregrish.com', 'www.goregrish.com',
  'crazyshit.com', 'www.crazyshit.com',
  'efukt.com', 'www.efukt.com',
  'kaotic.com', 'www.kaotic.com',

  // === HACKING/ILLEGAL ACTIVITIES ===
  'hackthissite.org', 'www.hackthissite.org',
  'thepiratebay.org', 'www.thepiratebay.org', 'thepiratebay.se',
  'wikileaks.org', 'www.wikileaks.org',
  'darkweblinks.net', 'www.darkweblinks.net',
  'illegalhack.com', 'www.illegalhack.com',
  '1337x.to', 'www.1337x.to',
  'rarbg.to', 'www.rarbg.to',
  'yts.mx', 'www.yts.mx',
  'kickasstorrents.to', 'www.kickasstorrents.to',
  'torrentz2.eu', 'www.torrentz2.eu',
  'silkroad.com', 'www.silkroad.com',

  // === HATE/EXTREMIST WEBSITES ===
  'gab.com', 'www.gab.com',
  'nationalvanguard.org', 'www.nationalvanguard.org',
  'dailystormer.su', 'www.dailystormer.su', 'dailystormer.name',
  'amren.com', 'www.amren.com',
  'vdare.com', 'www.vdare.com',
  'infowars.com', 'www.infowars.com',
  'bitchute.com', 'www.bitchute.com',
  'rumble.com', 'www.rumble.com',
  'parler.com', 'www.parler.com',
  'gettr.com', 'www.gettr.com',
]);

// Keyword patterns to catch similar/related dangerous sites
export const DANGEROUS_KEYWORD_PATTERNS = [
  // Porn-related keywords
  /porn/i, /xxx/i, /xnxx/i, /xvideo/i, /xhamster/i, /redtube/i, /youporn/i,
  /hentai/i, /rule34/i, /nhentai/i, /chaturbate/i, /stripchat/i, /livejasmin/i,
  /onlyfans/i, /fansly/i, /bongacams/i, /cam4/i, /camsoda/i, /myfreecams/i,
  /brazzers/i, /bangbros/i, /realitykings/i, /naughtyamerica/i,
  /porntrex/i, /eporner/i, /spankbang/i, /tnaflix/i, /tube8/i,

  // Gore/violence keywords
  /bestgore/i, /liveleak/i, /theync/i, /ogrish/i, /goregasm/i, /goregrish/i,
  /shockchan/i, /crazyshit/i, /kaotic/i, /efukt/i,

  // Gambling keywords in domain
  /casino/i, /poker(?!mon)/i, /betting/i, /slots(?!car)/i, /gambling/i,
  /bet365/i, /betway/i, /bovada/i, /draftkings/i, /fanduel/i,

  // Hate/extremist keywords
  /stormfront/i, /dailystormer/i, /nationalvanguard/i,

  // Torrent/piracy keywords
  /piratebay/i, /kickass.*torrent/i, /1337x/i, /rarbg/i, /torrentz/i,

  // Dark web keywords
  /darkweb/i, /silkroad/i, /\.onion/i,

  // Dangerous chat keywords
  /omegle/i, /chatroulette/i, /chatrandom/i, /camsurf/i, /emeraldchat/i,

  // Incel/extremist forum keywords
  /incels?\.(me|is|co|net)/i, /kiwifarms/i, /8kun/i, /8chan/i, /4chan/i,
];

// ============================================================================
// Domain Classification Functions
// ============================================================================

export function isSocialMediaSite(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (SOCIAL_MEDIA_DOMAINS.has(hostname)) return true;

    const withoutWww = hostname.replace(/^www\./, '');
    if (SOCIAL_MEDIA_DOMAINS.has(withoutWww)) return true;

    for (const domain of SOCIAL_MEDIA_DOMAINS) {
      if (hostname.endsWith('.' + domain) || hostname === domain) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export function getDangerousSiteCategory(hostname: string): DangerousSiteInfo | null {
  const lower = hostname.toLowerCase();

  if (DANGEROUS_BLOCKED_DOMAINS.has(lower) || DANGEROUS_BLOCKED_DOMAINS.has('www.' + lower)) {
    if (/porn|xxx|xvideo|xhamster|redtube|youporn|hentai|chaturbate|onlyfans|fansly|brazzers|stripchat|livejasmin|cam4|bongacams|camsoda|tube8|spankbang|eporner|nhentai|rule34/i.test(lower)) {
      return { category: 'pornography', reason: 'Pornographic content - not appropriate for any age', severity: 'critical' };
    }
    if (/gore|bestgore|liveleak|theync|ogrish|kaotic|crazyshit|shockchan/i.test(lower)) {
      return { category: 'violence', reason: 'Violent/graphic content - extremely disturbing material', severity: 'critical' };
    }
    if (/casino|poker|betting|slots|gambling|bet365|betway|bovada|draftkings|fanduel|stake|roobet/i.test(lower)) {
      return { category: 'gambling', reason: 'Gambling/betting site - illegal for minors', severity: 'high' };
    }
    if (/omegle|chatroulette|chatrandom|chatib|teenchat|talkwithstranger|e-chat|wireclub/i.test(lower)) {
      return { category: 'dangerous_chat', reason: 'Age-inappropriate chat room - risk of predators and unsuitable content', severity: 'critical' };
    }
    if (/4chan|8chan|8kun|kiwifarms|incels|stormfront|voat|somethingawful/i.test(lower)) {
      return { category: 'dangerous_forum', reason: 'Age-inappropriate forum - harassment, hate content, and unsuitable communities', severity: 'critical' };
    }
    if (/ashleymadison|adultfriendfinder|fling|benaughty|seeking|fetlife|grindr|meetme/i.test(lower)) {
      return { category: 'adult_dating', reason: 'Adult dating site - not appropriate for children', severity: 'high' };
    }
    if (/stormfront|dailystormer|nationalvanguard|gab|parler|gettr|infowars|bitchute|amren|vdare/i.test(lower)) {
      return { category: 'hate_extremist', reason: 'Hate/extremist content - promotes discrimination and violence', severity: 'critical' };
    }
    if (/piratebay|1337x|rarbg|kickass|torrentz|wikileaks|darkweb|silkroad/i.test(lower)) {
      return { category: 'illegal_activities', reason: 'Hacking/piracy/illegal content', severity: 'high' };
    }

    return { category: 'dangerous', reason: 'Age-inappropriate website - blocked for all ages', severity: 'critical' };
  }

  // Check keyword patterns
  for (const pattern of DANGEROUS_KEYWORD_PATTERNS) {
    if (pattern.test(lower)) {
      if (/porn|xxx|xvideo|hentai|chaturbate|onlyfans|brazzers/i.test(lower)) {
        return { category: 'pornography', reason: 'Pornographic content detected in URL', severity: 'critical' };
      }
      if (/gore|bestgore|liveleak|kaotic/i.test(lower)) {
        return { category: 'violence', reason: 'Violent/graphic content detected in URL', severity: 'critical' };
      }
      if (/casino|poker|betting|gambling/i.test(lower)) {
        return { category: 'gambling', reason: 'Gambling content detected in URL', severity: 'high' };
      }
      if (/omegle|chatroulette|chatrandom/i.test(lower)) {
        return { category: 'dangerous_chat', reason: 'Age-inappropriate chat site detected', severity: 'critical' };
      }
      if (/4chan|8chan|kiwifarms|incels/i.test(lower)) {
        return { category: 'dangerous_forum', reason: 'Age-inappropriate forum detected', severity: 'critical' };
      }
      if (/stormfront|dailystormer/i.test(lower)) {
        return { category: 'hate_extremist', reason: 'Hate/extremist content detected', severity: 'critical' };
      }
      if (/piratebay|torrent|darkweb/i.test(lower)) {
        return { category: 'illegal_activities', reason: 'Illegal content detected', severity: 'high' };
      }

      return { category: 'dangerous', reason: 'Potentially age-inappropriate content detected', severity: 'high' };
    }
  }

  return null;
}

export function isDangerousSite(url: string): DangerousSiteInfo | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    const result = getDangerousSiteCategory(hostname);
    if (result) return result;

    const withoutWww = hostname.replace(/^www\./, '');
    const resultWithoutWww = getDangerousSiteCategory(withoutWww);
    if (resultWithoutWww) return resultWithoutWww;

    const fullUrl = url.toLowerCase();
    for (const pattern of DANGEROUS_KEYWORD_PATTERNS) {
      if (pattern.test(fullUrl)) {
        return getDangerousSiteCategory(fullUrl) || { category: 'dangerous', reason: 'Age-inappropriate content detected in URL', severity: 'high' };
      }
    }

    return null;
  } catch {
    return null;
  }
}
