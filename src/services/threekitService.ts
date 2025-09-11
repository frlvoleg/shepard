import { ThreekitClient } from '@threekit/rest-api';

export class ThreekitService {
  private player: any;
  private configuratorPromise: Promise<any>;

  constructor(playerOrApi: any) {
    this.player = playerOrApi?.player ?? playerOrApi;
    if (!this.player) throw new Error('Threekit player is not ready');

    this.configuratorPromise = this.player.configurator
      ? Promise.resolve(this.player.configurator)
      : (this.player.getConfigurator?.() ??
        Promise.reject('getConfigurator() unavailable'));
  }

  private async cfg() {
    return this.configuratorPromise;
  }

  async getDisplayAttributes() {
    return (await this.cfg()).getDisplayAttributes();
  }
  async getAttributes() {
    return (await this.cfg()).getAttributes();
  }
  async getAttributeState() {
    return (await this.cfg()).getAttributeState();
  }
  async getFullConfiguration() {
    return (await this.cfg()).getFullConfiguration();
  }
  async setAttributeState(attrId: string, state: any) {
    return (await this.cfg()).setAttributeState(attrId, state);
  }
  async setConfiguration(cfg: any) {
    return (await this.cfg()).setConfiguration(cfg);
  }
  async getConfigurator(attrName: string) {
    return this.player.getConfigurator(attrName);
  }
  async setFullConfiguration(cfg: any) {
    return (await this.cfg()).setFullConfiguration(cfg);
  }
  async getNestedConfigurator(attrName: string): Promise<any>;
  async getNestedConfigurator(attrName: string, index: number): Promise<any>;
  async getNestedConfigurator(attrName: string, index?: number): Promise<any> {
    const configurator = await this.cfg();
    if (typeof index === 'number') {
      return configurator.getNestedConfigurator(attrName, index);
    }
    return configurator.getNestedConfigurator(attrName);
  }

  async getAssetsByTag(tag: string): Promise<any[]> {
    const env = process.env.TRBL_THREEKIT_ENV ?? 'preview';
    const isAdmin = env === 'admin-fts';
    const orgId = isAdmin
      ? process.env.THREEKIT_ADMIN_FTS_ORG_ID
      : process.env.THREEKIT_PREVIEW_ORG_ID;
    const token = isAdmin
      ? process.env.THREEKIT_ADMIN_FTS_PUBLIC_TOKEN
      : process.env.THREEKIT_PREVIEW_PUBLIC_TOKEN;
    const host = `${env}.threekit.com`;
    try {
      const client = new ThreekitClient({
        orgId: orgId!,
        host,
        publicToken: token!,
      });
      const response = await client.assets.get(
        { type: 'item', tags: [tag] },
        { perPage: 100, page: 1 }
      );
      const status = response?.status;
      const data = response?.data;
      if (status === 200 && data && typeof data !== 'string') {
        return data.assets ?? [];
      }
      return [];
    } catch (err) {
      return [];
    }
  }
}
