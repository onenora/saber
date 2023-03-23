import asyncio
from pagermaid import Config, log
from pagermaid.listener import listener
from pagermaid.enums import Client, Message, AsyncClient
from pagermaid.utils import lang, pip_install
import urllib.parse
import random

pip_install("duckduckgo_search")
# pip_install("nest_asyncio")

# import nest_asyncio
# nest_asyncio.apply()
from duckduckgo_search import ddg

@listener(command="ds",
          description="Duckduckgo Search",
          parameters="[text/reply]")
async def gs(client: Client, message: Message, request: AsyncClient):
    info = None
    msg = None
    try:
      text = message.arguments
      if not text:
          if not message.reply_to_message:
              m = await message.edit(lang('arg_error'))
              await asyncio.sleep(3)
              await message.safe_delete()
              await m.safe_delete()
              return 
          text = message.reply_to_message.text
          if not text:
              m = await message.edit(lang('arg_error'))
              await asyncio.sleep(3)
              await message.safe_delete()
              await m.safe_delete()
              return
      text = ' '.join(str(text).splitlines())
      info = await message.reply(f"搜索中...")
      params = { "q": text }
      encoded = urllib.parse.urlencode(params)
      url = f"https://duckduckgo.com?{encoded}"
      msg = f"[手动搜索 {text}]({url})"

      result = {}

      for i in ddg(text, region='us-en', safesearch='Off', max_results=5):
        result[i['href']] = {
          "title": i['title'],
          "body": i['body'],
        }
      await asyncio.sleep(random.random())
      for i in ddg(text, region='cn-zh', safesearch='Off', max_results=5):
        result[i['href']] = {
          "title": i['title'],
          "body": i['body'],
        }

      if result and len(result) > 0:
            links = ''
            i = 1
            for k in result:
              # print(k)
              v = result[k]
              title = v['title']
              body = v['body']
              links = f"{links}\n\n{i}. [{title}]({k})\n\n{body}"
              i+=1
            
            # links = '\n\n'.join(f"{i+1}. [{item[1]}]({item[0]})" for i, item in enumerate(result.items()))
            # links = '\n\n'.join(f"{i+1}. [{item[1]}]({item[0]})" for i, item in enumerate(result.items()))
            content = f"🔎 [{text}]({url}){links}"

            if message.reply_to_message:
              await message.reply_to_message.reply(content, disable_web_page_preview=True)
              await info.safe_delete()
              await message.safe_delete()
            else:
              # myself = await client.get_me()
              # print(myself.id)
              # print(message.from_user.id)
              # is_self = myself.id == message.from_user.id
              await message.reply(content, disable_web_page_preview=True)
              await info.safe_delete()
              await asyncio.sleep(5)
              await message.safe_delete()
      else:
          await message.reply(f"搜索失败\n\n{msg}")
          await info.safe_delete()
          await asyncio.sleep(5)
          await message.safe_delete()
    except Exception as e:
      emsg = f"搜索失败：{e}"
      if msg:
        emsg = f"搜索失败：{e}\n\n{msg}"
      m = await message.reply(emsg)
      if info:
        await info.safe_delete()
      await asyncio.sleep(5)
      await m.safe_delete()