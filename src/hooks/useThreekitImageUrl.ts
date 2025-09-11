import { useEffect, useState } from 'react';

type Mode = 'thumbnail' | 'original';

export function useThreekitImageUrl(
  assetId?: string | null,
  mode: Mode = 'thumbnail'
) {
  const [url, setUrl] = useState<string | null>(null);
  const orgId =
    process.env.REACT_APP_THREEKIT_PREVIEW_ORG_ID ||
    process.env.THREEKIT_PREVIEW_ORG_ID!;
  const token =
    process.env.REACT_APP_THREEKIT_PREVIEW_PUBLIC_TOKEN ||
    process.env.THREEKIT_PREVIEW_PUBLIC_TOKEN!;

  useEffect(() => {
    if (!assetId) {
      setUrl(null);
      return;
    }

    let cancelled = false;

    const getThumbnail = async () =>
      `https://preview.threekit.com/api/assets/${assetId}/thumbnail?orgId=${orgId}&bearer_token=${token}&size=1024`;

    const getOriginal = async () => {
      // 1) asset -> importedFileId
      const aResp = await fetch(
        `https://preview.threekit.com/api/assets/${assetId}?orgId=${orgId}&bearer_token=${token}`,
        { headers: { accept: 'application/json' } }
      );
      if (!aResp.ok) throw new Error(`Asset ${assetId} ${aResp.status}`);
      const aJson = await aResp.json();
      if (!aJson.importedFileId) throw new Error('No importedFileId');

      // 2) file -> hash
      const fResp = await fetch(
        `https://preview.threekit.com/api/files/${aJson.importedFileId}?orgId=${orgId}&bearer_token=${token}`,
        { headers: { accept: 'application/json' } }
      );
      if (!fResp.ok)
        throw new Error(`File ${aJson.importedFileId} ${fResp.status}`);
      const fJson = await fResp.json();
      if (!fJson.hash) throw new Error('No hash');

      // 3) final URL
      return `https://preview.threekit.com/api/files/hash/${fJson.hash}?orgId=${orgId}&bearer_token=${token}`;
    };

    (async () => {
      try {
        const finalUrl =
          mode === 'thumbnail' ? await getThumbnail() : await getOriginal();
        if (!cancelled) setUrl(finalUrl);
      } catch (e) {
        console.warn('Failed to resolve image url for asset', assetId, e);
        if (!cancelled) setUrl(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [assetId, mode, orgId, token]);

  return url;
}
