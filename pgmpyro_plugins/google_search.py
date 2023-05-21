'''谷歌搜索Version2.0'''
import asyncio
import urllib.parse
import random
from pagermaid import Config, log
from pagermaid.listener import listener
from pagermaid.enums import Message
from pagermaid.utils import lang, pip_install

pip_install("googlesearch-python")
from googlesearch import search

@listener(command="gs", 
        description="Search using Google", 
        parameters="[text/reply]")
async def gs(message: Message):
    try:
        text = message.arguments or message.reply_to_message.text
        if not text:
            info = await message.edit(lang(f"请提供搜索词~"))
            await asyncio.sleep(3)
            await message.safe_delete()
            await info.safe_delete()
            return

        info = await message.edit(lang(f"🤖正在努力搜索中...\n\n{text}"))
        url = f"https://www.google.com/search?q={urllib.parse.quote(text)}"
        result = {}
        for lang_code in ["en", "zh-cn"]:
            for item in search(text, num_results=5, lang=lang_code, advanced=True):
                result[item.url] = item.title
            await asyncio.sleep(random.random())
        if result:
            links = '\n'.join(f"{i+1}. [{title}]({url})" for i, (url, title) in enumerate(result.items()))
            content = f"🔎 | **Google** | [{text}]({url})\n\n{links}"
            await info.edit(content, disable_web_page_preview=True)
        else:
            await info.edit(f"卧槽～搜索失败了～\n[建议手动搜索 {text}]({url})")
    except Exception as e:
        emsg = f"搜索失败：{e}"
        info = await message.edit(emsg)
        await asyncio.sleep(3)
        await message.safe_delete()
        await info.safe_delete()