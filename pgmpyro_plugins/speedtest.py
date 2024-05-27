'''
speedtest 测速 Version 6.0
update 2024-05-27
author ikun & ChatGPT
'''
import os
import asyncio
import json
import requests
from pathlib import Path
from pagermaid.listener import listener
from pagermaid.enums import Client, Message
from pagermaid.utils import lang

plugins_dir = Path(__file__).parent.resolve()
speedtest_path = plugins_dir / "speedtest"

def convert_size(bytes_size, suffix="B", factor=1024):
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes_size < factor:
            return f"{bytes_size:.2f}{unit}{suffix}"
        bytes_size /= factor

@listener(
    command="st",
    need_admin=True,
    description=lang("speedtest_des"),
    parameters="(list/server id)",
)
async def speedtest(client: Client, message: Message) -> None:
    chat_id = message.chat.id
    args = message.text.strip().split()
    server_id = args[1] if len(args) > 1 else None
    edit_message = await message.edit("原神，启动...")

    async def run_speedtest(command):
        process = await asyncio.create_subprocess_exec(
            *command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            return str(stderr, "utf-8")
        return str(stdout, "utf-8")

    if not speedtest_path.exists():
        await edit_message.edit("下载 speedtest 中...")
        arch = os.uname().machine
        url = f"https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-linux-{arch}.tgz"
        try:
            with requests.get(url, stream=True) as response:
                response.raise_for_status()
                with open(f"{speedtest_path}.tgz", "wb") as file:
                    for chunk in response.iter_content(chunk_size=8192):
                        file.write(chunk)
            import tarfile

            with tarfile.open(f"{speedtest_path}.tgz", "r:*") as tar:
                tar.extractall(path=plugins_dir)
        except Exception as e:
            return await edit_message.edit(f"可莉被琴团长关禁闭啦~ {e}")

    if speedtest_path.exists():
        command = [
            str(speedtest_path),
            "--format=json-pretty",
            "--progress=no",
            "--accept-license",
            "--accept-gdpr",
        ]
        if server_id == "list":
            command.append("-L")
            await edit_message.edit("可莉正在到处炸鱼...")
            output = await run_speedtest(command)
            try:
                servers = json.loads(output)["servers"]
                content = "这些地点可以被轰炸,请尽情炸鱼吧~\n\n"
                for server in servers:
                    content += f"▪️ `{server['id']}`: `{server['name']} - {server['location']} {server['country']}`\n"
                await edit_message.edit(content)
            except (ValueError, KeyError):
                await edit_message.edit("附近没有地点可以让可莉炸鱼哦...")
        else:
            if server_id:
                command.append(f"--server-id={server_id}")
            output = await run_speedtest(command)
            try:
                data = json.loads(output)
                await message.delete()
                content = (
                    f"**原神 启动！！！**\n"
                    f"枫丹: {data['server']['name']}\n"
                    f"炸鱼地: {data['server']['location']} ㉿ {data['server']['country']}\n"
                    f"上传速度: {convert_size(data['download']['bandwidth'], suffix='B/s')} ~ {convert_size(data['download']['bytes'], suffix='B', factor=1000)}\n"
                    f"下载速度: {convert_size(data['upload']['bandwidth'], suffix='B/s')} ~ {convert_size(data['upload']['bytes'], suffix='B', factor=1000)}\n"
                    f"你 也 是 原？？？\n"
                )
                await client.send_photo(
                    chat_id, photo=f"{data['result']['url']}.png", caption=content
                )
            except ValueError:
                await edit_message.edit(f"没有找到一点鱼欸...\n{output}")