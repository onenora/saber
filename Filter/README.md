
#### DOMAIN-SET:

- **直连域名列表 direct.txt**：
  - [https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/direct.txt](https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/direct.txt)
- **代理域名列表 proxy.txt**：
  - [https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/proxy.txt](https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/proxy.txt)
- **广告域名列表 reject.txt**：
  - [https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/reject.txt](https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/reject.txt)

- **GFWList 域名列表 gfw.txt**：
  - [https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/gfw.txt](https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/gfw.txt)
- **Telegram 使用的 IP 地址列表 telegramcidr.list**：
  - [https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/telegram.list](https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/telegram.list)

#### 白名单模式（推荐）

⚠️ 注意：

- 白名单模式，意为「**没有命中规则的网络流量，统统使用代理**」，适用于服务器线路网络质量稳定、快速，不缺服务器流量的用户。
- 以下配置中，除了 `DIRECT` 和 `REJECT` 是默认存在于 Surge 中的 policy（路由策略/流量处理策略），其余均为自定义 policy，对应配置文件中 `[Proxy]` 或 `[Proxy Group]` 中的代理名称。如你直接使用下面的 `[Rule]` 规则，则需要在 `[Proxy]` 或 `[Proxy Group]` 中手动配置一个名为 `PROXY` 的 policy。
- 如你希望 Apple、iCloud 和 Google 列表中的域名使用代理，则把 policy 由 `DIRECT` 改为 `PROXY`，以此类推，举一反三。

**DOMAIN-SET：**

```
[Rule]
PROCESS-NAME,v2ray,DIRECT
PROCESS-NAME,xray,DIRECT
PROCESS-NAME,clash,DIRECT
PROCESS-NAME,naive,DIRECT
PROCESS-NAME,trojan,DIRECT
PROCESS-NAME,trojan-go,DIRECT
PROCESS-NAME,ss-local,DIRECT
PROCESS-NAME,privoxy,DIRECT
PROCESS-NAME,leaf,DIRECT
PROCESS-NAME,Thunder,DIRECT
PROCESS-NAME,DownloadService,DIRECT
PROCESS-NAME,qBittorrent,DIRECT
PROCESS-NAME,Transmission,DIRECT
PROCESS-NAME,fdm,DIRECT
PROCESS-NAME,aria2c,DIRECT
PROCESS-NAME,Folx,DIRECT
PROCESS-NAME,NetTransport,DIRECT
PROCESS-NAME,uTorrent,DIRECT
PROCESS-NAME,WebTorrent,DIRECT
DOMAIN-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/reject.txt,REJECT
RULE-SET,SYSTEM,DIRECT
DOMAIN-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/proxy.txt,PROXY
DOMAIN-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/direct.txt,DIRECT
RULE-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/telegram.list,PROXY
RULE-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/gpt.list,PROXY
RULE-SET,LAN,DIRECT
FINAL,PROXY,dns-failed
```
#### 黑色名单模式

⚠️ 注意：

- 黑名单模式，意为「**只有命中规则的网络流量，才使用代理**」，适用于服务器线路网络质量不稳定或不够快，或服务器流量紧缺的用户。通常也是软路由用户、家庭网关用户的常用模式。
- 以下配置中，除了 `DIRECT` 和 `REJECT` 是默认存在于 Surge 中的 policy（路由策略/流量处理策略），其余均为自定义 policy，对应配置文件中 `[Proxy]` 或 `[Proxy Group]` 中的代理名称。如你直接使用下面的 `[Rule]` 规则，则需要在 `[Proxy]` 或 `[Proxy Group]` 中手动配置一个名为 `PROXY` 的 policy。

**DOMAIN-SET：**

```
[Rule]
PROCESS-NAME,v2ray,DIRECT
PROCESS-NAME,clash,DIRECT
PROCESS-NAME,ss-local,DIRECT
PROCESS-NAME,privoxy,DIRECT
PROCESS-NAME,trojan,DIRECT
PROCESS-NAME,trojan-go,DIRECT
PROCESS-NAME,naive,DIRECT
PROCESS-NAME,Thunder,DIRECT
PROCESS-NAME,DownloadService,DIRECT
PROCESS-NAME,qBittorrent,DIRECT
PROCESS-NAME,Transmission,DIRECT
PROCESS-NAME,fdm,DIRECT
PROCESS-NAME,aria2c,DIRECT
PROCESS-NAME,Folx,DIRECT
PROCESS-NAME,NetTransport,DIRECT
PROCESS-NAME,uTorrent,DIRECT
PROCESS-NAME,WebTorrent,DIRECT
DOMAIN-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/direct.txt,DIRECT
DOMAIN-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/Apple.txt,DIRECT
RULE-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/reject.txt,REJECT
RULE-SET,SYSTEM,DIRECT
RULE-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/telegram.list,PROXY
RULE-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/gpt.list,PROXY
DOMAIN-SET,https://fastly.jsdelivr.net/gh/onenora/saber@main/Filter/gfw.txt,PROXY
FINAL,DIRECT,dns-failed
```
## 致谢

- [@Loyalsoldier/geoip](https://github.com/Loyalsoldier/geoip)
- [@Loyalsoldier/v2ray-rules-dat](https://github.com/Loyalsoldier/v2ray-rules-dat)
- [@v2fly/domain-list-community](https://github.com/v2fly/domain-list-community)
- [@felixonmars/dnsmasq-china-list](https://github.com/felixonmars/dnsmasq-china-list)
- [@17mon/china_ip_list](https://github.com/17mon/china_ip_list)
