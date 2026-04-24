/**
 * Extracts the 'src' value from an iframe string or returns the string if it's already a URL.
 */
export const extractIframeSrc = (input: string): string => {
  if (!input) return '';
  
  let result = input.trim();
  
  // If it's an iframe tag, extract src
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      result = srcMatch[1];
    }
  }
  
  // Handle protocol-relative URLs
  if (result.startsWith('//')) {
    result = 'https:' + result;
  }
  
  return result;
};

/**
 * Converts various video platform URLs to their embeddable counterparts.
 * Supports YouTube and Odysee.
 */
export const getVideoEmbedUrl = (url: string): string => {
  const cleanUrl = extractIframeSrc(url);
  if (!cleanUrl) return '';
  
  // Already an embed URL
  if (cleanUrl.includes('/embed/')) return cleanUrl;

  try {
    const urlObj = new URL(cleanUrl);
    const host = urlObj.hostname.toLowerCase();

    // YouTube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let videoId = '';
      if (host.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
        if (!videoId && urlObj.pathname.startsWith('/v/')) {
          videoId = urlObj.pathname.split('/')[2];
        }
      } else if (host.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Odysee
    if (host.includes('odysee.com')) {
      const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart.includes(':')) {
           const embedPath = lastPart.replace(':', '/');
           return `https://odysee.com/$/embed/${embedPath}`;
        } else {
           return `https://odysee.com/$/embed/${lastPart}`;
        }
      }
    }

    // Rumble
    if (host.includes('rumble.com')) {
      // If it's already an embed URL, it was caught by the /embed/ check above
      // But if it's a share URL like https://rumble.com/v76qw8m-video-title.html
      const path = urlObj.pathname;
      const vMatch = path.match(/^\/v([a-z0-9]+)-/i);
      if (vMatch && vMatch[1]) {
        return `https://rumble.com/embed/v${vMatch[1]}/`;
      }
    }
  } catch (e) {
    console.warn("Invalid URL passed to getVideoEmbedUrl:", url);
  }

  return cleanUrl;
};
