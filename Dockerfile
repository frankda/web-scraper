FROM node:20@sha256:cb7cd40ba6483f37f791e1aace576df449fc5f75332c19ff59e2c6064797160e

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV SHELL /bin/bash

# Configure default locale (important for chrome-headless-shell). 
ENV LANG en_US.UTF-8

USER root

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -

# Install google-chrome-stable
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Create a user with name 'app' and group that will be used to run the app
RUN groupadd -r app && useradd -rm -g app -G audio,video app

USER app

WORKDIR /home/app

COPY . /home/app

ENV DBUS_SESSION_BUS_ADDRESS autolaunch:

RUN pnpm install --frozen-lockfile

CMD ["pnpm", "start"]

EXPOSE 3000