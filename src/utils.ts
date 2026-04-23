/**
 * Converts various video platform URLs to their embeddable counterparts.
 * Supports YouTube and Odysee.
 */
export const getVideoEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('/embed/')) return url;

  try {
    const urlObj = new URL(url);
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
      // Pattern: https://odysee.com/@ChannelName:id/VideoName:vId
      // Or: https://odysee.com/VideoName:vId
      const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
      
      if (pathParts.length > 0) {
        // Get the last part which is usually VideoName:vId
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart.includes(':')) {
           // Replace first colon with slash for embed format
           const embedPath = lastPart.replace(':', '/');
           return `https://odysee.com/$/embed/${embedPath}`;
        } else {
           // Fallback for names without IDs
           return `https://odysee.com/$/embed/${lastPart}`;
        }
      }
    }
  } catch (e) {
    console.warn("Invalid URL passed to getVideoEmbedUrl:", url);
  }

  return url;
};
