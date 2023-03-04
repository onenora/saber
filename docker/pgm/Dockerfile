FROM python:3.11.2-slim-bullseye
LABEL maintainer="altriabot@gmail.com"
ENV SHELL=/bin/bash \
    PS1="\u@\h:\w \$ " \
    DEBIAN_FRONTEND=noninteractive \
    RUN_AS_ROOT=true
WORKDIR /pagermaid_pyro
RUN \
    apt-get update \
    && apt-get install --no-install-recommends -y \
        init \
        nano \
        git \
        wget \
        curl \
        neofetch \
        build-essential \
    ## 克隆仓库
    && git clone -b master https://github.com/TeamPGM/PagerMaid-Pyro.git /pagermaid_pyro \
    && git config --global pull.ff only \
    && cd /pagermaid_pyro \
    ## pip install
    && python3 -m pip install --upgrade pip \
    && pip install -r requirements.txt \
    && mv config.gen.yml config.yml \
    ## 卸载编译依赖，清理安装缓存
    && apt-get purge --auto-remove -y build-essential \
    && apt-get clean -y \
    && rm -rf \
        /tmp/* \
        /var/lib/apt/lists/* \
        /var/tmp/* \
        ~/.cache

COPY ./pagermaid_pyro.service /etc/systemd/system
CMD ["/sbin/init"]
