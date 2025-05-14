export function parseJwt(token: string) {
    try {
      // JWT'nin payload kısmını al
      const base64Url = token.split('.')[1];
      
      // Base64 URL karakter düzeltmeleri
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Base64'ü çözümle (UTF-8 desteği ile)
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parsing error:', error);
      return null;
    }
  }