import asyncio
import random
import urllib.parse
from pagermaid import Config, log
from pagermaid.listener import listener
from pagermaid.enums import Client, Message, AsyncClient
from pagermaid.utils import lang, pip_install

pip_install("duckduckgo_search")
from duckduckgo_search import ddg
@listener(command="ds", description="DuckDuckGo Search", parameters="[text/reply]")
async def duckduckgo(client: Client, message: Message, request: AsyncClient):
    try:
        text = message.arguments or (message.reply_to_message.text if message.reply_to_message else None)
        if not text:
            m = await message.edit(lang('arg_error'))
            await asyncio.sleep(3)
            await m.safe_delete()
            return

        text = ' '.join(str(text).splitlines())
        info = await message.edit(f"🤖正在努力搜索中...\n\n{text}")
        params = {"q": text}
        encoded = urllib.parse.urlencode(params)
        url = f"https://duckduckgo.com?{encoded}"
        msg = f"[手动搜索 {text}]({url})"
        result = {}
        regions = ['us-en', 'cn-zh']
        max_results = 5

        for region in regions:
            for i in ddg(text, region=region, safesearch='Off', max_results=max_results):
                result[i['href']] = i['title']
            await asyncio.sleep(random.random())

        if result and len(result) > 0:
            links = '\n'.join(f"{i+1}. [{v}]({k})" for i, (k, v) in enumerate(result.items()))
            content = f"🔎 | **DuckduckGo** | [{text}]({url})\n\n{links}"
            await info.edit(content, disable_web_page_preview=True)
        else:
            await info.edit(f"搜索失败\n\n{msg}")

    except Exception as e:
        emsg = f"搜索失败：{e}"
        if msg:
            emsg = f"搜索失败：{e}\n\n{msg}"
        m = await message.reply(emsg)
        await asyncio.sleep(5)
        await m.safe_delete()


