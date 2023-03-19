'''谷歌搜索Version1.0'''
import requests
from urllib import parse

from pagermaid import Config, log
from pagermaid.listener import listener
from pagermaid.enums import Message
from pagermaid.utils import lang, pip_install

pip_install("googlesearch-python")
from googlesearch import search

@listener(command="google",
          description=lang('google_des'),
          parameters="[text]")
async def google(message: Message):
    title = None
    result = {}
    args = message.text.strip().split()
    arg = args[1:] if len(args) > 1 else None
    reply = message.reply_to_message_id if message.reply_to_message_id else None
    if arg:
        text = ' '.join(arg)
    elif reply:
        text = message.reply_to_message.text if message.reply_to_message.text else message.reply_to_message.caption
    else:
        await message.edit(lang("请加入搜索内容~"))

    if text:
        await message.edit(lang(f"正在努力搜索了主人...\n\n{text}"))
        for i in search(text, advanced=True):
            result[i.title] = i.url
            if len(result) > 4:
                break
        if result:
            links = '\n'.join(f"{i+1}、 [{item[0]}]({item[1]})" for i, item in enumerate(result.items()))
            content = f"🔎 | **Google** | [{text}](https://www.google.com/search?q={parse.quote(text)})\n\n{links}"
            await message.edit(text=content, disable_web_page_preview=True)
        else:
            await message.edit(lang(f"NB,搜索失败了~\n建议手动搜索:[{text}](https://www.google.com/search?q={parse.quote(text)})"))




import telegram
from urllib import parse
from googlesearch import search
from gettext import gettext as _

@listener(command="google",
          description=_("Search using Google"),
          parameters="[text]")
async def google(update: telegram.Update, context: telegram.ext.CallbackContext):
    title = None
    result = {}
    text = ' '.join(context.args)
    if not text and update.message.reply_to_message:
        text = update.message.reply_to_message.text or update.message.reply_to_message.caption
    if text:
        await update.message.edit_text(_("Searching for {} ...").format(text))
        for i in search(text):
            result[i.title] = i.url
            if len(result) > 4:
                break
        if result:
            links = 'nn'.join(f"{i+1}、 [{item[0]}]({item[1]})" for i, item in enumerate(result.items()))
            content = f"🔎 | Google | [{text}](https://www.google.com/search?q={parse.quote(text)})nn{links}"
            await update.message.edit_text(text=content, disable_web_page_preview=True)
        else:
            await update.message.edit_text(_("Sorry, I couldn't find any results for {}.").format(text))
    else:
        await update.message.edit_text(_("Please provide a search text."))



