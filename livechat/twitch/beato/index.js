let totalMessages = 0,
  messagesLimit = 0,
  nickColor = "user",
  removeSelector,
  addition,
  customNickColor,
  channelName,
  provider;
let animationIn = "bounceIn";
let animationOut = "bounceIn";
let hideAfter = 1600;
let hideCommands = "no";
let ignoredUsers = [];
let previousSender = "";
let mergeMessages = false;
let role = ["subscriber", "viewer", "moderator"];
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limitText(text) {
  if (text.length > 14) {
    return text.substring(0, 13) + "..";
  } else {
    return text;
  }
}

window.addEventListener("onEventReceived", function (obj) {
  if (obj.detail.listener === "event") return;

  if (
    [
      "follower-latest",
      "subscriber-latest",
      "cheer-latest",
      "raid-latest",
      "tip-latest",
    ].includes(obj.detail.listener)
  ) {
    addGenericEvent(obj.detail.listener, obj.detail.event);
    return;
  }

  if (obj.detail.event.listener === "widget-button") {
    if (obj.detail.event.field === "testMessage") {
      let emulated = new CustomEvent("onEventReceived", {
        detail: {
          listener: "message",
          event: {
            service: "twitch",
            data: {
              time: Date.now(),
              tags: {
                "badge-info": "",
                badges: "moderator/1,partner/1",
                color: "#5B99FF",
                "display-name": "StreamElements",
                emotes: "25:46-50",
                flags: "",
                id: "43285909-412c-4eee-b80d-89f72ba53142",
                mod: "0",
                "room-id": "85827806",
                subscriber: getRandomInt(0, 1).toString(),
                "tmi-sent-ts": "1579444549265",
                turbo: "0",
                "user-id": "100135110",
                "user-type": "mod",
              },
              nick: channelName,
              userId: "100135110",
              //displayName: channelName,
              displayName: limitText(channelName),

              displayColor: "#5B99FF",
              badges: [
                {
                  type: role[getRandomInt(0, 2)],
                  version: "1",
                  url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                  description: role[getRandomInt(0, 2)],
                },
                {
                  type: "partner",
                  version: "1",
                  url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                  description: "Verified",
                },
              ],
              channel: channelName,
              text: "Howdy! My name is Bill",
              //text: "Howdy! My name is Bill and I am here to serve Kappa cuabosc coiasc caiusc asoiac asic aoisc aoisc",
              isAction: !1,
              emotes: [
                {
                  type: "twitch",
                  name: "Kappa",
                  id: "25",
                  gif: !1,
                  urls: {
                    1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                    2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                    4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0",
                  },
                  start: 46,
                  end: 50,
                },
              ],
              msgId: "43285909-412c-4eee-b80d-89f72ba53142",
            },
            renderedText:
              ' asdaklsjdkl ajs dasd ajsdkajsd kas dasdkajsdakjsdasjdakjsdjHowdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">',
          },
        },
      });
      window.dispatchEvent(emulated);
    }
    return;
  }
  if (obj.detail.listener === "delete-message") {
    const msgId = obj.detail.event.msgId;
    $(`[data-msgid=${msgId}]`).remove();
    return;
  } else if (obj.detail.listener === "delete-messages") {
    const sender = obj.detail.event.userId;
    $(`.message-row[data-sender=${sender}]`).remove();
    return;
  }
  // if (obj.detail.listener !== "message") return
  let data = obj.detail.event.data;
  if (data.text.startsWith("!") && hideCommands === "yes") return;
  if (ignoredUsers.indexOf(data.nick) !== -1) return;
  let message = attachEmotes(data);
  let badges = "",
    badge;
  if (provider === "mixer") {
    data.badges.push({ url: data.avatar });
  }
  for (let i = 0; i < data.badges.length; i++) {
    badge = data.badges[i];
    if (/Moderator/i.test(badge.description)) {
      badges = "moderator";
    }
  }
  let username = data.displayName;
  if (nickColor === "user") {
    const color =
      data.displayColor !== ""
        ? data.displayColor
        : "#" + md5(username).slice(26);
    username = `<span style="color:${color}">${username}</span>`;
  } else if (nickColor === "custom") {
    const color = customNickColor;
    username = `<span style="color:${color}">${username}</span>`;
  } else if (nickColor === "remove") {
    username = "";
  }

  addMessage(
    username,
    badges,
    message,
    data.isAction,
    data.userId,
    data.msgId,
    data.tags.subscriber === "1"
  );
  previousSender = data.userId;
});

window.addEventListener("onWidgetLoad", function (obj) {
  const fieldData = obj.detail.fieldData;
  animationIn = fieldData.animationIn || animationIn;
  animationOut = fieldData.animationOut || animationOut;
  hideAfter = fieldData.hideAfter || hideAfter;
  messagesLimit = fieldData.messagesLimit;
  nickColor = fieldData.nickColor;
  customNickColor = fieldData.customNickColor;
  hideCommands = fieldData.hideCommands;
  channelName = obj.detail.channel.username;
  mergeMessages = fieldData.mergeMessages === "yes";
  fetch(
    "https://api.streamelements.com/kappa/v2/channels/" +
      obj.detail.channel.id +
      "/"
  )
    .then((response) => response.json())
    .then((profile) => {
      provider = profile.provider;
    });
  if (fieldData.alignMessages === "block") {
    addition = "prepend";
    removeSelector = ".message-row:nth-child(n+" + (messagesLimit + 1) + ")";
  } else {
    addition = "append";
    removeSelector =
      ".message-row:nth-last-child(n+" + (messagesLimit + 1) + ")";
  }

  ignoredUsers = fieldData.ignoredUsers
    .toLowerCase()
    .replace(" ", "")
    .split(",");
});

function attachEmotes(message) {
  let text = html_encode(message.text);
  let data = message.emotes;
  if (typeof message.attachment !== "undefined") {
    if (typeof message.attachment.media !== "undefined") {
      if (typeof message.attachment.media.image !== "undefined") {
        text = `${message.text}<img src="${message.attachment.media.image.src}">`;
      }
    }
  }
  return text.replace(/([^\s]*)/gi, function (m, key) {
    let result = data.filter((emote) => {
      return html_encode(emote.name) === key;
    });
    if (typeof result[0] !== "undefined") {
      let url = result[0]["urls"][1];
      if (provider === "twitch") {
        return `<img class="emote" " src="${url}"/>`;
      } else {
        if (typeof result[0].coords === "undefined") {
          result[0].coords = { x: 0, y: 0 };
        }
        let x = parseInt(result[0].coords.x);
        let y = parseInt(result[0].coords.y);

        let width = "12px";
        let height = "auto";

        if (provider === "mixer") {
          if (result[0].coords.width) {
            width = `${result[0].coords.width}px`;
          }
          if (result[0].coords.height) {
            height = `${result[0].coords.height}px`;
          }
        }
        return `<div class="emote" style="width: ${width} height:${height} display: inline-block background-image: url(${url}) background-position: -${x}px -${y}px"></div>`;
      }
    } else return key;
  });
}

function html_encode(e) {
  return e.replace(/[<div>"^]/g, function (e) {
    return "&#" + e.charCodeAt(0) + ";";
  });
}

function addMessage(
  username,
  badges,
  message,
  isAction,
  uid,
  msgId,
  subscriber
) {
  totalMessages += 1;
  let actionClass = "";
  if (isAction) {
    actionClass = "action";
  }
  if (mergeMessages && previousSender === uid) {
    const lastMessage =
      document.querySelector(".main-container").lastElementChild;
    const messageElement = document.createElement("span");
    messageElement.innerHTML = `&nbsp${message}`; // Use `messageText` or your actual message content variable here
    messageElement.dataset.sender = uid;
    messageElement.dataset.msgid = msgId;
    lastMessage.querySelector(".user-message").appendChild(messageElement);
    return;
  }

  const element = $.parseHTML(`
  <div data-sender="${uid}" data-msgid="${msgId}" class="message-row " id="msg-${totalMessages}">
    <div class="message-wrapper ${
      badges ? badges : subscriber ? "subscriber" : "viewer"
    }">
      <div class="user-status "></div>
      <div class="user-box ${actionClass}">
        
        <span>${username}</span>
      </div>
      <div class="user-message ${actionClass}"><span>${message}</span></div>
    </div>
  </div>`);

  setElement(element);
}

function addGenericEvent(kind, data) {
  if (data.isCommunityGift) return;

  let event = kind;

  if (kind === "subscriber-latest" && data.bulkGifted) {
    event = "sub-gift-latest";
  } else if (kind === "subscriber-latest" && data.gifted) {
    event = "personal-gift-latest";
  }

  const tier = {
    prime: "Prime",
    1000: "Tier 1",
    2000: "Tier 2",
    3000: "Tier 3",
  };

  const text = {
    "follower-latest": `{{latestFollowerWording}}`,
    "subscriber-latest": `{{latestSubscriberWording}}`,
    "cheer-latest": `{{latestCheerWording}}`,
    "raid-latest": `{{latestRaidWording}}`,
    "sub-gift-latest": `{{latestSubGiftWording}}`,
    "personal-gift-latest": `{{latestPersonalGiftWording}}`,
    "tip-latest": `{{latestTipWording}}`,
  };

  const element = $.parseHTML(`
  <div class="message-row ">
    <div class="event-wrapper ${event}">
      <div class="event-header ${event} ${
    data.message ? "event-header--extend" : ""
  }">
        <div class="event-ico ${event}"></div>
        <div class="event-user ${event}">
          <span>${data.name}</span>
        </div>
        <div class="event-text">
          ${text[event]}
        </div>
      </div>
      <div class="event-decoration ${event}"></div>
      <div class="event-message ${data.message ? "" : "event-message--hide"}">
        ${data.message}
      </div>
    </div>
  </div>`);

  setElement(element);
}

function setElement(element) {
  if (addition === "append") {
    if (hideAfter !== 999) {
      $(element)
        .appendTo(".main-container")
        .delay(hideAfter * 1000)
        .queue(function () {
          $(this)
            .removeClass(animationIn)
            .addClass(animationOut)
            .delay(1000)
            .queue(function () {
              $(this).remove();
            })
            .dequeue();
        });
      return;
    } else {
      $(element).appendTo(".main-container");
    }
  } else {
    if (hideAfter !== 999) {
      $(element)
        .prependTo(".main-container")
        .delay(hideAfter * 1000)
        .queue(function () {
          $(this)
            .removeClass(animationIn)
            .addClass(animationOut)
            .delay(1000)
            .queue(function () {
              $(this).remove();
            })
            .dequeue();
        });
    } else {
      $(element).prependTo(".main-container");
    }
  }

  if (totalMessages > messagesLimit) {
    removeRow();
  }
}

function removeRow() {
  if (!$(removeSelector).length) {
    return;
  }
  if (animationOut !== "none" || !$(removeSelector).hasClass(animationOut)) {
    if (hideAfter !== 999) {
      $(removeSelector).dequeue();
    } else {
      $(removeSelector)
        .addClass(animationOut)
        .delay(1000)
        .queue(function () {
          $(this).remove().dequeue();
        });
    }
    return;
  }

  $(removeSelector).animate(
    {
      height: 0,
      opacity: 0,
    },
    "slow",
    function () {
      $(removeSelector).remove();
    }
  );
}
