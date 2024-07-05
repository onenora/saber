/***********************************

> 应用名称：酷安净化
> 脚本作者：RuCu6
> 更新时间：2023-11-15 17:20
> 特别说明：⚠️⚠️⚠️本脚本仅供学习交流使用，禁止转载、售卖⚠️⚠️⚠️
		  
[Map Local]
^https:\/\/api\.coolapk\.com\/v6\/search\?.*type=hotSearch data-type=text data="{}" status-code=200

[Script]
移除酷安广告 = type=http-response, pattern=^https:\/\/api\.coolapk\.com\/v6\/feed\/(detail|replyList)\?, script-path=https://raw.githubusercontent.com/onenora/saber/main/Scripts/coolapk.js, requires-body=true

移除酷安广告 = type=http-response, pattern=^https:\/\/api\.coolapk\.com\/v6\/main\/(dataList|indexV8|init), script-path=https://raw.githubusercontent.com/onenora/saber/main/Scripts/coolapk.js, requires-body=true

移除酷安广告 = type=http-response, pattern=^https:\/\/api\.coolapk\.com\/v6\/page\/dataList\?, script-path=https://raw.githubusercontent.com/onenora/saber/main/Scripts/coolapk.js, requires-body=true

[MITM]
hostname = %APPEND% api.coolapk.com

***********************************/

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/feed/detail")) {
  if (obj.data?.hotReplyRows?.length > 0) {
    obj.data.hotReplyRows = obj.data.hotReplyRows.filter((item) => item?.id);
  }
  if (obj.data?.topReplyRows?.length > 0) {
    obj.data.topReplyRows = obj.data.topReplyRows.filter((item) => item?.id);
  }
  const item = ["detailSponsorCard", "include_goods", "include_goods_ids"];
  for (let i of item) {
    if (obj.data?.[i]) {
      obj.data[i] = [];
    }
  }
} else if (url.includes("/feed/replyList")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter((item) => item?.id);
  }
} else if (url.includes("/main/dataList")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter((item) => !(item?.entityTemplate === "sponsorCard" || item?.title === "精选配件"));
  }
} else if (url.includes("/main/indexV8")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter(
      (item) =>
        !(
          item?.entityTemplate === "sponsorCard" ||
          item?.entityId === 8639 ||
          item?.entityId === 29349 ||
          item?.entityId === 33006 ||
          item?.entityId === 32557 ||
          item?.title?.includes("值得买") ||
          item?.title?.includes("红包")
        )
    );
  }
} else if (url.includes("/main/init")) {
  // 整体配置
  if (obj.data?.length > 0) {
    let newDatas = [];
    for (let item of obj.data) {
      // 944热门搜索 945开屏广告 6390首页Tab
      if ([944, 945, 6390]?.includes(item?.entityId)) {
        continue;
      } else {
        if (item?.entityId === 20131) {
          // 发现页 顶部项目
          if (item?.entities?.length > 0) {
            let newEnts = [];
            for (let i of item.entities) {
              if (i?.title === "酷品") {
                continue;
              } else {
                newEnts.push(i);
              }
            }
            item.entities = newEnts;
          }
        }
        newDatas.push(item);
      }
    }
    obj.data = newDatas;
  }
} else if (url.includes("/page/dataList")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter(
      (item) =>
        !(item?.title === "酷安热搜" || item?.entityTemplate === "imageScaleCard" || item?.entityTemplate === "sponsorCard")
    );
  }
}

$done({ body: JSON.stringify(obj) });
