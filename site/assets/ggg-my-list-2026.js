(function () {
  "use strict";

  var MAIN_KEY = "ggg-list";
  var MY_LIST_KEY = "ggg-list-My List";
  var scheduled = false;

  function amazonAffiliateUrl(url, maker, model) {
    try {
      if (/^https:\/\/(www\.)?amazon\.com\//i.test(url || "")) {
        var amazon = new URL(url);
        amazon.searchParams.set("tag", "gearguruguide-20");
        return amazon.toString();
      }
    } catch (error) {}
    var terms = ((maker || "") + " " + (model || "")).trim();
    return "https://www.amazon.com/s?k=" + encodeURIComponent(terms).replace(/%20/g, "+") + "&tag=gearguruguide-20";
  }

  function readList(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function unique(items) {
    var saved = [];
    var positions = Object.create(null);
    items.forEach(function (item) {
      if (!item) return;
      var normalized = Object.assign({}, item, { qty: Math.max(1, Number(item.qty) || 1) });
      var affiliate = amazonAffiliateUrl(normalized.url || normalized.officialUrl, normalized.maker, normalized.model);
      if (normalized.url) normalized.url = affiliate;
      normalized.officialUrl = affiliate;
      normalized.hasAmazon = true;
      var identity = String(normalized.url || normalized.officialUrl || normalized.id || "");
      if (!identity) return;
      if (positions[identity] === undefined) {
        positions[identity] = saved.length;
        saved.push(normalized);
      } else {
        var old = saved[positions[identity]];
        saved[positions[identity]] = Object.assign({}, old, normalized, { qty: Math.max(old.qty || 1, normalized.qty) });
      }
    });
    return saved;
  }

  function unitCount(items) {
    return items.reduce(function (total, item) {
      return total + Math.max(1, Number(item.qty) || 1);
    }, 0);
  }

  function writeMyList(items) {
    var clean = unique(items);
    try {
      localStorage.setItem(MAIN_KEY, JSON.stringify(clean));
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(clean));
    } catch (error) {
      return clean;
    }
    updateCounts(unitCount(clean));
    return clean;
  }

  function mergeSavedLists() {
    return writeMyList(readList(MAIN_KEY).concat(readList(MY_LIST_KEY)));
  }

  function currentList() {
    var named = readList(MY_LIST_KEY);
    return named.length ? named : readList(MAIN_KEY);
  }

  function updateCounts(forcedCount) {
    var count = typeof forcedCount === "number" ? forcedCount : unitCount(currentList());
    document.querySelectorAll(".persistent-list-link, nav .nav-list-btn").forEach(function (button) {
      var label = "MY LIST (" + count + ")";
      var accessibleLabel = "Open My List with " + count + " saved " + (count === 1 ? "product" : "products");
      if (button.textContent !== label) button.textContent = label;
      if (button.getAttribute("aria-label") !== accessibleLabel) button.setAttribute("aria-label", accessibleLabel);
    });
  }

  function openMyList() {
    var appButton = document.querySelector("nav .nav-list-btn");
    if (appButton) appButton.click();
  }

  function ensureHeaderLink() {
    var header = document.querySelector(".site-header");
    if (!header || header.querySelector(".persistent-list-link")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "persistent-list-link";
    button.addEventListener("click", openMyList);
    var cta = header.querySelector(".nav-cta");
    header.insertBefore(button, cta || null);
    updateCounts();
  }

  function ensureBrandIdentity() {
    document.querySelectorAll(".brand-mark").forEach(function (mark) {
      if (mark.textContent !== "GGG") mark.textContent = "GGG";
      mark.setAttribute("aria-label", "Gear Guru Guide");
    });
    var brand = document.querySelector(".site-header .brand");
    if (!brand) return;
    var label = Array.prototype.slice.call(brand.children).find(function (child) {
      return child.tagName === "SPAN" && !child.classList.contains("brand-mark");
    });
    if (!label || label.dataset.gggBrandExpanded) return;
    label.dataset.gggBrandExpanded = "true";
    label.className = "brand-name-expanded";
    label.textContent = "";
    var name = document.createElement("strong");
    name.textContent = "GEAR GURU GUIDE";
    var domain = document.createElement("small");
    domain.textContent = "GEARGURUGUIDE.COM";
    label.appendChild(name);
    label.appendChild(domain);
  }

  function fixHeadline() {
    document.querySelectorAll(".feature-story h2").forEach(function (heading) {
      if (heading.dataset.gggHeadlineFixed) return;
      var text = heading.textContent.replace(/\s+/g, " ").trim().toLowerCase();
      if (text !== "the humanoids are finally at the trailhead.") return;
      heading.dataset.gggHeadlineFixed = "true";
      heading.textContent = "";
      ["The humanoids", "are finally at the", "trailhead."].forEach(function (line) {
        var row = document.createElement("span");
        row.className = "headline-line";
        row.textContent = line;
        heading.appendChild(row);
      });
    });
  }

  var EXPANDED_TRIP_ACTIVITIES = [
    "Rock Climbing",
    "Mountaineering",
    "Bikepacking",
    "Canyoneering",
    "Surfing",
    "Sailing",
    "Scuba Diving",
    "Horseback & Pack Stock",
    "Search & Rescue",
    "Off-Road & 4x4",
    "Hiking & Day Trips",
    "Adventure Racing"
  ];

  function ensureTripBuilderExpansion() {
    var heading = document.querySelector(".trip-strip h2");
    if (heading && !heading.dataset.gggFullName) {
      heading.dataset.gggFullName = "true";
      heading.textContent = "";
      heading.appendChild(document.createTextNode("Tell Gear Guru Guide your trip. "));
      var emphasis = document.createElement("em");
      emphasis.textContent = "Get your gear list.";
      heading.appendChild(emphasis);
    }
    var sports = document.querySelector(".trip-sports");
    if (!sports) return;
    EXPANDED_TRIP_ACTIVITIES.forEach(function (label) {
      var exists = Array.prototype.some.call(sports.querySelectorAll(".sport-pill"), function (button) {
        return button.textContent.trim().toLowerCase() === label.toLowerCase();
      });
      if (exists) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "sport-pill ggg-expanded-sport";
      button.textContent = label;
      button.addEventListener("click", function () {
        sports.querySelectorAll(".sport-pill").forEach(function (pill) { pill.classList.remove("active"); });
        button.classList.add("active");
        var input = document.querySelector(".trip-input");
        if (input) {
          var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          setter.call(input, label);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      sports.appendChild(button);
    });
  }

  function tripItemFromLink(link, index) {
    var label = link.querySelector("strong");
    var name = (label ? label.textContent : link.textContent)
      .replace(/^\s*\d+\.\s*/, "")
      .replace(/\s*↗\s*$/, "")
      .trim();
    var url = link.href;
    var hash = 0;
    for (var i = 0; i < url.length; i += 1) hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
    return {
      id: "trip-" + Math.abs(hash) + "-" + index,
      maker: "TRIP PICK",
      model: name,
      url: url,
      hasAmazon: /amazon\./i.test(url),
      qty: 1
    };
  }

  function ensureTripSaveButton() {
    document.querySelectorAll(".trip-reply").forEach(function (reply) {
      var toolbar = reply.querySelector(".trip-reply-toolbar");
      if (!toolbar || toolbar.querySelector(".trip-save-btn")) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "trip-copy-btn trip-save-btn";
      button.textContent = "♡ SAVE TO MY LIST";
      button.addEventListener("click", function () {
        var links = Array.prototype.slice.call(reply.querySelectorAll(".trip-linked-groups a"));
        var additions = links.map(tripItemFromLink);
        var saved = writeMyList(currentList().concat(additions));
        button.textContent = "✓ SAVED " + additions.length + " PICKS";
        setTimeout(function () {
          button.textContent = "♡ SAVE TO MY LIST";
        }, 1800);
        updateCounts(unitCount(saved));
      });
      var copyButton = toolbar.querySelector(".trip-copy-btn");
      toolbar.insertBefore(button, copyButton || null);
    });
  }

  function listAsText(items) {
    return "MY GEAR GURU GUIDE LIST\n\n" + items.map(function (item, index) {
      return (index + 1) + ". " + item.maker + " " + item.model + " — QTY: " + (item.qty || 1) + "\n" + (item.url || item.officialUrl || "");
    }).join("\n\n");
  }

  function itemIdentity(item) {
    return String(item.url || item.officialUrl || item.id || "");
  }

  function itemForCard(card) {
    var link = card && card.querySelector(".product-link-btn");
    if (!link) return null;
    var url = link.href;
    return currentList().find(function (item) {
      return (item.url || item.officialUrl || "") === url;
    }) || null;
  }

  function buildQuantityControl(item) {
    var control = document.createElement("span");
    control.className = "quantity-control";
    control.dataset.listKey = itemIdentity(item);
    var minus = document.createElement("button");
    minus.type = "button";
    minus.className = "qty-minus";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");
    var amount = document.createElement("strong");
    amount.textContent = String(Math.max(1, Number(item.qty) || 1));
    amount.setAttribute("aria-label", "Quantity " + amount.textContent);
    var plus = document.createElement("button");
    plus.type = "button";
    plus.className = "qty-plus";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");
    control.appendChild(minus);
    control.appendChild(amount);
    control.appendChild(plus);
    return control;
  }

  function ensureProductControls() {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var add = card.querySelector(".add-list-btn");
      var share = card.querySelector(".share-btn");
      var item = itemForCard(card);
      if (add) {
        var actions = add.parentElement;
        actions.classList.add("product-action-stack");
        if (item) {
          if (add.textContent !== "✓ IN LIST") add.textContent = "✓ IN LIST";
          add.classList.add("is-saved");
          add.setAttribute("aria-label", "Already saved to My List");
          var control = actions.querySelector(".quantity-control");
          if (!control) {
            control = buildQuantityControl(item);
            actions.insertBefore(control, share || add.nextSibling);
          } else {
            control.dataset.listKey = itemIdentity(item);
            var quantity = String(item.qty || 1);
            if (control.querySelector("strong").textContent !== quantity) control.querySelector("strong").textContent = quantity;
          }
        } else {
          if (add.textContent !== "+ LIST") add.textContent = "+ LIST";
          add.classList.remove("is-saved");
          var stale = actions.querySelector(".quantity-control");
          if (stale) stale.remove();
        }
      } else if (share && /REMOVE/i.test(share.textContent) && item) {
        var savedActions = share.parentElement;
        savedActions.classList.add("saved-list-actions");
        var savedControl = savedActions.querySelector(".quantity-control");
        if (!savedControl) {
          savedControl = buildQuantityControl(item);
          savedActions.insertBefore(savedControl, share);
        } else {
          savedControl.dataset.listKey = itemIdentity(item);
          var savedQuantity = String(item.qty || 1);
          if (savedControl.querySelector("strong").textContent !== savedQuantity) savedControl.querySelector("strong").textContent = savedQuantity;
        }
      }
    });
  }

  function ensureAmazonAffiliateLinks() {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var heading = card.querySelector("h2, h3");
      var label = heading ? heading.textContent.replace(/\s+/g, " ").trim() : "Outdoor gear";
      card.querySelectorAll(".product-link-btn, .affiliate-offer a").forEach(function (link) {
        var next = amazonAffiliateUrl(link.href, "", label);
        if (link.href !== next) link.href = next;
        link.rel = "noopener noreferrer sponsored";
        link.target = "_blank";
        link.dataset.gggAmazonAffiliate = "true";
      });
    });
  }

  function normalizeTypography() {
    var catalogHeading = document.querySelector(".catalog-heading h2");
    if (catalogHeading && !catalogHeading.dataset.gggTypeFixed) {
      catalogHeading.dataset.gggTypeFixed = "true";
      catalogHeading.textContent = "";
      catalogHeading.appendChild(document.createTextNode("The high-consideration "));
      var emphasis = document.createElement("em");
      emphasis.textContent = "watchlist.";
      catalogHeading.appendChild(emphasis);
    }
  }

  function enforceHomepageSectionOrder() {
    var guides = document.querySelector(".guide-callout");
    var catalog = document.querySelector(".catalog-section");
    if (guides && catalog && guides.nextElementSibling !== catalog) {
      guides.insertAdjacentElement("afterend", catalog);
    }
  }

  function improveFieldNotes() {
    var assistance = document.querySelector(".note-card-a");
    if (assistance && !assistance.dataset.gggExpandedCopy) {
      assistance.dataset.gggExpandedCopy = "true";
      var assistanceTitle = assistance.querySelector("h3");
      var assistanceCopy = assistance.querySelector("p:not(.card-index)");
      if (assistanceTitle) assistanceTitle.textContent = "Assistance is not a medical claim—and gear is not treatment.";
      if (assistanceCopy) assistanceCopy.textContent = "Assistive exoskeletons, powered mobility, and recovery equipment are evaluated as consumer gear. We keep manufacturer claims, actual capability, fit limits, safety considerations, and professional medical guidance separate so a buying guide never pretends to diagnose or treat anyone.";
    }
    var system = document.querySelector(".note-card-b");
    if (system && !system.dataset.gggExpandedCopy) {
      system.dataset.gggExpandedCopy = "true";
      var systemTitle = system.querySelector("h3");
      var systemCopy = system.querySelector("p:not(.card-index)");
      if (systemTitle) systemTitle.textContent = "High-consideration gear needs a decision system—not a hype cycle.";
      if (systemCopy) systemCopy.textContent = "Expensive equipment has to work as part of the whole carry. We weigh service support, packed weight, power and charging, field repairability, weather exposure, transport, required training, failure consequences, and the friction you only discover after leaving the parking lot.";
    }
  }

  var CHAT_TOPICS = [
    { name: "backpacking", words: ["backpack", "hike", "hiking", "expedition", "trek"], reply: "For backpacking, start with shelter, carry, navigation, water treatment, sleep systems, foot care, and dependable power. Tell me the trip length, weather, and terrain for a tighter list." },
    { name: "water and paddle", words: ["paddle", "kayak", "canoe", "water", "rafting"], reply: "For water and paddle trips, I would prioritize flotation and safety, waterproof storage, navigation, communication, sun protection, transport, and repair gear—not unrelated powered mobility products." },
    { name: "wildland firefighting", words: ["wildland", "firefighter", "firefighting", "fire"], reply: "For wildland firefighting, focus on approved protective equipment, boots and foot care, hydration, communications, lighting, navigation, and recovery gear. Agency requirements always come before a shopping list." },
    { name: "mountain biking", words: ["mountain bike", "biking", "cycling", "bike"], reply: "For mountain biking, start with a certified helmet, eye protection, repair tools, hydration, navigation, lighting, protective apparel, and emergency communication." },
    { name: "ice climbing", words: ["ice climb", "climbing", "alpine", "crampon"], reply: "For ice climbing, the core system is helmet, harness, tools, crampons, ropes and protection, insulated layers, gloves, navigation, and emergency communication. Technical equipment must match your training and route." },
    { name: "robot gear carrying", words: ["humanoid", "robot dog", "robot", "bad back", "carry my gear"], reply: "For robotic gear carrying, compare real payload, terrain limits, runtime, weather protection, cargo attachment, control method, and how the group will recover the machine if it fails. Robot dogs are currently the more practical outdoor form." },
    { name: "snow and ski", words: ["snow", "ski", "skiing", "winter", "avalanche"], reply: "For snow and ski travel, think in systems: avalanche equipment and training where applicable, insulation, eye protection, navigation, communication, traction, repair, hydration, and cold-weather power." },
    { name: "hunting and fishing", words: ["hunt", "hunting", "fish", "fishing"], reply: "For hunting and fishing, useful categories include optics, navigation, communication, weather protection, water safety, storage, lighting, field tools, and emergency supplies." }
  ];

  var PRODUCT_CATALOG_PROMISE = null;
  var ACTIVITY_PROFILES = [
    {
      name: "Water & Paddle",
      triggers: ["water & paddle", "water and paddle", "paddle", "paddling", "kayak", "canoe", "rafting", "packraft", "sup"],
      exclude: ["wildland", "firefighter", "fire line", "fireline", "nfpa", "tactical", "hiking boot", "trail boot", "avalanche", "ski boot", "snowshoe", "crampon"],
      categories: {
        Mobility: ["kayak cart", "canoe cart", "boat transport", "launch transport", "transport cart", "canoe transport", "portage", "paddleboy"],
        Navigation: ["marine", "fishfinder", "chartplotter", "gps", "compass", "mapping"],
        Power: ["waterproof power", "weather-resistant power", "rugged power bank", "waterproof power bank", "solar panel"],
        Capture: ["waterproof", "action camera", "underwater", "marine"],
        Shelter: ["dry bag", "waterproof duffel", "submersible", "roll-top", "paddling"],
        Camp: ["packraft", "whitewater", "water filter", "water treatment", "cooler", "waterproof carryall"],
        Connectivity: ["marine vhf", "floating handheld", "personal locator beacon", "satellite", "emergency signaling"],
        Apparel: ["paddling", "wetsuit", "drysuit", "wetshoe", "immersion", "semi-dry", "rash guard", "water shoe"],
        Safety: ["pfd", "personal flotation", "life vest", "rescue", "throw bag", "flotation"],
        Lighting: ["waterproof", "ipx8", "marine"]
      }
    },
    {
      name: "Wildland Firefighting",
      triggers: ["wildland", "firefighter", "firefighting", "fire line", "fireline"],
      exclude: ["pfd", "kayak", "canoe", "paddling", "ski", "snowboard", "crampon"],
      categories: {
        Navigation: ["gps", "mapping", "compass", "navigation"], Power: ["rugged", "portable power", "battery", "solar"],
        Camp: ["hydration", "water bottle", "water filter", "canteen"], Connectivity: ["radio", "satellite", "communicator", "emergency"],
        Apparel: ["wildland", "firefighter", "fire resistant", "nomex", "tactical pant"], Safety: ["wildland", "firefighter", "fire line", "nomex", "helmet", "emergency supplies"],
        Lighting: ["headlamp", "area light", "lantern", "rugged"]
      }
    },
    {
      name: "Expedition Backpacking",
      triggers: ["expedition backpacking", "backpacking", "backpack", "trek", "thru-hike", "denali"],
      exclude: ["wildland firefighter", "fire line", "pfd", "kayak cart", "marine vhf"],
      categories: {
        Mobility: ["hike assist", "walking-assist", "exoskeleton"], Navigation: ["gps", "mapping", "compass", "watch"], Power: ["power bank", "portable battery", "usb-c", "compact power"],
        Capture: ["action camera", "camera", "drone"], Shelter: ["backpack", "tent", "shelter", "sleeping", "dry bag"], Camp: ["water filter", "stove", "cook", "hydration", "coffee"],
        Connectivity: ["satellite", "communicator", "emergency", "radio"], Apparel: ["hiking", "trail", "base layer", "rain", "blister", "chafing"],
        Safety: ["emergency supplies", "helmet", "emergency", "bear"], Lighting: ["headlamp", "lantern", "backcountry"]
      }
    },
    {
      name: "Mountain Biking",
      triggers: ["mountain biking", "mountain bike", "biking", "cycling", "bike"],
      exclude: ["wildland", "fire line", "pfd", "kayak", "ski", "crampon"],
      categories: {
        Mobility: ["bike", "e-mtb", "cycling"], Navigation: ["cycling", "gps", "watch", "navigation"], Power: ["power bank", "portable battery", "usb-c", "compact power"], Capture: ["action camera", "helmet camera", "camera"],
        Shelter: ["hydration pack", "bikepacking"], Camp: ["bike repair", "multi-tool", "hydration"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["cycling", "bike", "chafing"], Safety: ["bike helmet", "cycling helmet", "mips"], Lighting: ["bike light", "headlamp", "lighting"]
      }
    },
    {
      name: "Ice Climbing",
      triggers: ["ice climbing", "ice climb", "alpine climbing", "crampon"],
      exclude: ["wildland", "fire line", "pfd", "kayak", "fishing", "cycling"],
      categories: {
        Navigation: ["gps", "mapping", "compass", "alpine"], Power: ["power bank", "portable battery", "usb-c", "compact power"], Capture: ["action camera", "camera"], Shelter: ["alpine tent", "four-season", "winter tent", "bivy"],
        Camp: ["ice", "climbing", "crampon", "helmet", "mountaineering"], Connectivity: ["satellite", "communicator", "emergency"], Apparel: ["insulated", "mountaineering", "alpine", "glove", "base layer"],
        Safety: ["climbing", "helmet", "avalanche", "emergency supplies"], Lighting: ["headlamp", "alpine", "waterproof"]
      }
    },
    {
      name: "Hunting & Fishing",
      triggers: ["hunting & fishing", "hunting and fishing", "hunt", "hunting", "fish", "fishing"],
      exclude: ["wildland firefighter", "fire line", "ski boot", "crampon"],
      categories: {
        Mobility: ["kayak cart", "boat transport", "atv", "e-bike"], Navigation: ["fishfinder", "gps", "mapping", "compass"], Power: ["portable power", "battery", "solar"], Capture: ["camera", "action camera", "drone"],
        Shelter: ["hunting pack", "tent", "dry bag", "waterproof duffel"], Camp: ["cooler", "water filter", "knife", "packraft"], Connectivity: ["radio", "satellite", "locator beacon"],
        Apparel: ["hunting", "camouflage", "waterproof hunting", "hunting boot"], Safety: ["pfd", "life vest", "emergency supplies", "bear"], Lighting: ["headlamp", "lantern", "spotlight"]
      }
    },
    {
      name: "Overlanding",
      triggers: ["overlanding", "overland", "vehicle camping", "car camping"],
      exclude: ["wildland firefighter", "fire line", "pfd", "crampon", "kayak", "canoe", "paddling", "boat transport"],
      categories: {
        Mobility: ["e-bike", "electric bike", "off-road vehicle"], Navigation: ["gpsmap", "handheld mapping", "overland", "mapping"], Power: ["power station", "solar", "battery", "generator"], Capture: ["camera", "drone", "action camera"],
        Shelter: ["roof tent", "tent", "awning", "shelter", "storage"], Camp: ["cooler", "stove", "cook", "water", "coffee"], Connectivity: ["satellite", "radio", "communicator"],
        Safety: ["emergency supplies", "recovery", "emergency"], Lighting: ["area light", "lantern", "headlamp", "vehicle"]
      }
    },
    {
      name: "Trail Running",
      triggers: ["trail running", "trail run", "running", "ultrarunning", "ultra marathon"],
      exclude: ["wildland", "fire line", "pfd", "kayak", "ski boot", "crampon", "heavy-load"],
      categories: {
        Navigation: ["running", "gps watch", "watch", "navigation"], Power: ["power bank", "portable battery", "usb-c", "lightweight power"], Capture: ["action camera", "compact camera"], Shelter: ["running vest", "hydration pack"],
        Camp: ["hydration", "water filter", "nutrition"], Connectivity: ["satellite", "communicator", "emergency"], Apparel: ["trail running", "running", "shoe", "chafing", "blister"],
        Safety: ["emergency supplies", "emergency", "visibility"], Lighting: ["running headlamp", "headlamp", "lightweight"]
      }
    },
    {
      name: "Base Camp",
      triggers: ["base camp", "basecamp", "camping", "camp"],
      exclude: ["wildland firefighter", "fire line", "pfd", "kayak cart", "crampon"],
      categories: {
        Navigation: ["gps", "mapping", "weather"], Power: ["power station", "solar", "battery", "generator"], Capture: ["camera", "drone", "action camera"], Shelter: ["tent", "shelter", "sleeping", "canopy"],
        Camp: ["stove", "cook", "cooler", "water", "coffee", "camp"], Connectivity: ["satellite", "radio", "communicator", "internet"], Apparel: ["insulated", "rain", "base layer"],
        Safety: ["emergency supplies", "emergency", "bear"], Lighting: ["lantern", "area light", "headlamp"]
      }
    },
    {
      name: "Snow & Ski",
      triggers: ["snow & ski", "snow and ski", "ski", "skiing", "snowboard", "snowshoe", "winter"],
      exclude: ["wildland", "fire line", "pfd", "kayak", "fishing"],
      categories: {
        Mobility: ["ski", "snowshoe", "winter mobility"], Navigation: ["ski", "gps", "mapping", "watch"], Power: ["power bank", "portable battery", "usb-c", "compact power"], Capture: ["action camera", "camera"],
        Shelter: ["winter", "expedition", "four-season", "tent"], Camp: ["winter stove", "cold weather", "four-season"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["ski", "snow", "insulated", "base layer", "glove"], Safety: ["avalanche", "ski helmet", "helmet", "rescue"], Lighting: ["headlamp", "winter", "waterproof"]
      }
    },
    {
      name: "Rock Climbing",
      triggers: ["rock climbing", "rock climb", "sport climbing", "trad climbing", "bouldering"],
      exclude: ["wildland", "pfd", "kayak", "ski", "snowboard", "fishing"],
      categories: {
        Navigation: ["gps", "mapping", "compass", "watch"], Power: ["power bank", "portable battery", "compact power"], Capture: ["action camera", "camera", "climbing"],
        Shelter: ["bivy", "backpack", "shelter"], Camp: ["climbing", "helmet", "water filter", "hydration"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["climbing", "approach", "base layer", "rain"], Safety: ["climbing", "helmet", "emergency supplies", "rescue"], Lighting: ["headlamp", "climbing", "compact"]
      }
    },
    {
      name: "Mountaineering",
      triggers: ["mountaineering", "mountain ascent", "alpine expedition", "summit climb"],
      exclude: ["wildland", "pfd", "kayak", "cycling", "fishing"],
      categories: {
        Navigation: ["gps", "mapping", "compass", "alpine"], Power: ["power bank", "cold weather", "portable battery"], Capture: ["action camera", "camera"],
        Shelter: ["four-season", "alpine tent", "expedition", "bivy"], Camp: ["mountaineering", "stove", "water filter", "crampon"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["mountaineering", "insulated", "alpine", "glove", "base layer"], Safety: ["climbing", "avalanche", "helmet", "rescue"], Lighting: ["headlamp", "alpine", "waterproof"]
      }
    },
    {
      name: "Bikepacking",
      triggers: ["bikepacking", "bike packing", "bicycle touring", "cycle touring"],
      exclude: ["wildland", "pfd", "kayak", "ski", "crampon"],
      categories: {
        Mobility: ["bike", "cycling", "e-bike"], Navigation: ["cycling", "gps", "mapping", "watch"], Power: ["power bank", "solar", "portable battery"], Capture: ["action camera", "camera"],
        Shelter: ["bikepacking", "tent", "bivy", "dry bag"], Camp: ["bike repair", "multi-tool", "stove", "water filter"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["cycling", "bike", "rain", "chafing"], Safety: ["bike helmet", "visibility", "emergency supplies"], Lighting: ["bike light", "headlamp", "lighting"]
      }
    },
    {
      name: "Canyoneering",
      triggers: ["canyoneering", "canyon descent", "slot canyon"],
      exclude: ["wildland", "fireline", "ski", "snowboard", "cycling", "hunting"],
      categories: {
        Navigation: ["gps", "mapping", "compass"], Power: ["waterproof power", "rugged power bank"], Capture: ["waterproof", "action camera"],
        Shelter: ["dry bag", "waterproof", "bivy"], Camp: ["climbing", "helmet", "water filter", "hydration"], Connectivity: ["satellite", "personal locator", "emergency"],
        Apparel: ["wetsuit", "water shoe", "climbing", "quick dry"], Safety: ["climbing", "helmet", "rescue", "emergency supplies"], Lighting: ["waterproof", "headlamp", "ipx8"]
      }
    },
    {
      name: "Surfing",
      triggers: ["surfing", "surf trip", "surf camp"],
      exclude: ["wildland", "fireline", "ski", "crampon", "cycling", "hunting"],
      categories: {
        Navigation: ["marine", "gps", "weather"], Power: ["waterproof power", "power bank"], Capture: ["waterproof", "action camera", "underwater"],
        Shelter: ["dry bag", "waterproof duffel", "beach shelter"], Camp: ["waterproof", "cooler", "water bottle"], Connectivity: ["personal locator", "satellite", "emergency"],
        Apparel: ["wetsuit", "rash guard", "water shoe", "sun"], Safety: ["flotation", "rescue", "emergency supplies"], Lighting: ["waterproof", "headlamp"]
      }
    },
    {
      name: "Sailing",
      triggers: ["sailing", "sailboat", "offshore sailing", "coastal sailing"],
      exclude: ["wildland", "fireline", "ski", "crampon", "cycling"],
      categories: {
        Navigation: ["marine", "chartplotter", "gps", "compass"], Power: ["marine", "solar", "weather-resistant power", "power bank"], Capture: ["waterproof", "action camera", "marine"],
        Shelter: ["dry bag", "waterproof duffel", "submersible"], Camp: ["waterproof", "cooler", "water treatment"], Connectivity: ["marine vhf", "personal locator beacon", "satellite"],
        Apparel: ["drysuit", "paddling", "waterproof", "immersion"], Safety: ["pfd", "life vest", "flotation", "rescue"], Lighting: ["marine", "waterproof", "ipx8"]
      }
    },
    {
      name: "Scuba Diving",
      triggers: ["scuba diving", "scuba", "diving trip", "dive trip"],
      exclude: ["wildland", "fireline", "ski", "crampon", "cycling", "hiking boot"],
      categories: {
        Navigation: ["marine", "compass", "gps"], Power: ["waterproof power", "rugged power bank"], Capture: ["underwater", "waterproof", "action camera"],
        Shelter: ["dry bag", "submersible", "waterproof duffel"], Connectivity: ["personal locator beacon", "marine vhf", "emergency"], Apparel: ["wetsuit", "drysuit", "water shoe"],
        Safety: ["rescue", "flotation", "emergency supplies"], Lighting: ["underwater", "waterproof", "ipx8"]
      }
    },
    {
      name: "Horseback & Pack Stock",
      triggers: ["horseback", "horse packing", "pack stock", "equestrian trail"],
      exclude: ["robot", "quadruped", "e-bike", "cycling", "pfd", "ski"],
      categories: {
        Navigation: ["gps", "mapping", "compass"], Power: ["power bank", "portable battery", "solar"], Capture: ["camera", "action camera"], Shelter: ["tent", "shelter", "dry bag"],
        Camp: ["water filter", "stove", "hydration", "camp"], Connectivity: ["satellite", "radio", "communicator"], Apparel: ["rain", "hiking", "insulated"],
        Safety: ["emergency supplies", "helmet", "emergency"], Lighting: ["headlamp", "lantern"]
      }
    },
    {
      name: "Search & Rescue",
      triggers: ["search & rescue", "search and rescue", "sar team", "rescue team"],
      exclude: ["recreational toy", "surf", "fishing"],
      categories: {
        Navigation: ["gps", "mapping", "compass", "navigation"], Power: ["rugged", "power bank", "portable power", "battery"], Capture: ["camera", "action camera", "thermal"],
        Shelter: ["bivy", "shelter", "tent", "dry bag"], Camp: ["water filter", "hydration", "multi-tool"], Connectivity: ["radio", "satellite", "communicator", "emergency"],
        Apparel: ["visibility", "waterproof", "insulated", "glove"], Safety: ["rescue", "emergency supplies", "helmet", "emergency"], Lighting: ["headlamp", "area light", "searchlight", "rugged"]
      }
    },
    {
      name: "Off-Road & 4x4",
      triggers: ["off-road & 4x4", "off-road", "off road", "4x4", "four wheeling"],
      exclude: ["wildland firefighter", "pfd", "crampon", "kayak", "canoe"],
      categories: {
        Mobility: ["off-road vehicle", "e-bike", "electric bike"], Navigation: ["gpsmap", "overland", "mapping", "handheld"], Power: ["power station", "solar", "battery", "generator"], Capture: ["camera", "drone", "action camera"],
        Shelter: ["roof tent", "awning", "tent", "storage"], Camp: ["cooler", "stove", "water", "recovery"], Connectivity: ["radio", "satellite", "communicator"],
        Safety: ["recovery", "emergency supplies", "emergency"], Lighting: ["vehicle", "area light", "lantern", "headlamp"]
      }
    },
    {
      name: "Hiking & Day Trips",
      triggers: ["hiking & day trips", "day hiking", "day hike", "hiking trip"],
      exclude: ["wildland firefighter", "pfd", "marine vhf", "ski boot", "crampon"],
      categories: {
        Navigation: ["gps", "mapping", "compass", "watch"], Power: ["power bank", "portable battery", "compact power"], Capture: ["camera", "action camera"],
        Shelter: ["daypack", "backpack", "rain", "dry bag"], Camp: ["water filter", "hydration", "multi-tool"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["hiking", "trail", "rain", "blister"], Safety: ["emergency supplies", "bear", "emergency"], Lighting: ["headlamp", "compact", "backcountry"]
      }
    },
    {
      name: "Adventure Racing",
      triggers: ["adventure racing", "adventure race", "multisport race", "expedition race"],
      exclude: ["wildland", "fireline", "heavy-load", "ski boot"],
      categories: {
        Navigation: ["gps", "compass", "watch", "mapping"], Power: ["power bank", "portable battery", "lightweight power"], Capture: ["action camera", "compact camera"],
        Shelter: ["bivy", "hydration pack", "dry bag"], Camp: ["hydration", "water filter", "nutrition", "multi-tool"], Connectivity: ["satellite", "communicator", "emergency"],
        Apparel: ["trail running", "cycling", "chafing", "rain"], Safety: ["helmet", "emergency supplies", "visibility"], Lighting: ["running headlamp", "headlamp", "lightweight"]
      }
    }
  ];

  function loadProductCatalog() {
    if (!PRODUCT_CATALOG_PROMISE) {
      PRODUCT_CATALOG_PROMISE = fetch("/assets/ggg-products.json?build=affiliate-links-clean-v10")
        .then(function (response) { if (!response.ok) throw new Error("catalog"); return response.json(); });
    }
    return PRODUCT_CATALOG_PROMISE;
  }

  function detectActivityProfile(query) {
    var lower = query.toLowerCase();
    var matches = ACTIVITY_PROFILES.map(function (profile) {
      var longest = profile.triggers.reduce(function (length, trigger) {
        return lower.indexOf(trigger) !== -1 ? Math.max(length, trigger.length) : length;
      }, 0);
      return { profile: profile, longest: longest };
    }).filter(function (entry) { return entry.longest > 0; });
    matches.sort(function (a, b) { return b.longest - a.longest; });
    return matches.length ? matches[0].profile : null;
  }

  function countTermMatches(text, terms) {
    return terms.reduce(function (total, term) { return total + (text.indexOf(term) !== -1 ? 1 : 0); }, 0);
  }

  function recommendProducts(products, query) {
    var profile = detectActivityProfile(query);
    var queryTerms = query.toLowerCase().split(/[^a-z0-9]+/).filter(function (term) { return term.length > 2; });
    var categories = profile ? Object.keys(profile.categories) : Array.from(new Set(products.map(function (product) { return product.category; })));
    if (profile && categories.indexOf("Emergency Supplies") === -1) categories.push("Emergency Supplies");
    return categories.map(function (category) {
      var firstAidTerms = {
        "Water & Paddle": ["waterproof", "wound", "bleeding", "blister", "emergency"],
        "Wildland Firefighting": ["trauma", "bleeding", "burn", "tourniquet", "emergency"],
        "Expedition Backpacking": ["wilderness", "backpacking", "blister", "splint", "compact"],
        "Mountain Biking": ["trauma", "bleeding", "splint", "compact", "emergency"],
        "Ice Climbing": ["trauma", "splint", "bleeding", "expedition", "emergency"],
        "Hunting & Fishing": ["trauma", "bleeding", "wound", "tourniquet", "emergency"],
        "Overlanding": ["trauma", "vehicle", "comprehensive", "bleeding", "emergency"],
        "Trail Running": ["ultralight", "blister", "compact", "wound", "emergency"],
        "Base Camp": ["comprehensive", "group", "trauma", "wound", "emergency"],
        "Snow & Ski": ["trauma", "splint", "compact", "bleeding", "emergency"]
      };
      var categoryTerms = profile ? (profile.categories[category] || firstAidTerms[profile.name] || ["emergency supplies", "trauma", "emergency"]) : queryTerms;
      var ranked = products.filter(function (product) {
        if (product.category !== category) return false;
        var text = (product.maker + " " + product.model + " " + product.focus + " " + product.status).toLowerCase();
        if (profile && profile.exclude.some(function (term) { return text.indexOf(term) !== -1; })) return false;
        if (isDesignatedWildernessQuery(query) && isMechanicalConflict(product)) return false;
        return countTermMatches(text, categoryTerms) > 0;
      }).map(function (product) {
        var text = (product.maker + " " + product.model + " " + product.focus + " " + product.status).toLowerCase();
        var categoryScore = countTermMatches(text, categoryTerms) * 8;
        var queryScore = countTermMatches(text, queryTerms) * 2;
        var amazonScore = product.hasAmazon ? 0.5 : 0;
        var curatedScore = profile && profile.name === "Water & Paddle" && product.status === "Curated paddling fallback" ? 30 : 0;
        return { product: product, score: categoryScore + queryScore + amazonScore + curatedScore };
      }).sort(function (a, b) { return b.score - a.score || a.product.id - b.product.id; });
      var used = Object.create(null);
      var selected = ranked.filter(function (entry) {
        var key = (entry.product.maker + "|" + entry.product.model).toLowerCase();
        if (used[key]) return false;
        used[key] = true;
        return true;
      }).slice(0, 3).map(function (entry) { return entry.product; });
      return { name: category, items: selected };
    }).filter(function (group) { return group.items.length > 0; });
  }

  function isDesignatedWildernessQuery(query) {
    return /\bbob marshall\b|\bdesignated wilderness\b|\bwilderness area\b/i.test(query || "");
  }

  function isMechanicalConflict(product) {
    var text = (product.category + " " + product.maker + " " + product.model + " " + product.focus).toLowerCase();
    return product.category === "Robotics" || product.category === "Mobility" || /robot|quadruped|humanoid|drone|e-bike|electric bike|motorized|kayak cart|canoe cart|transport cart|wheeled|exoskeleton/.test(text);
  }

  function renderSmartTripList(query, groups) {
    var old = document.querySelector(".smart-trip-reply");
    if (old) old.remove();
    var row = document.querySelector(".trip-input-row");
    if (!row) return;
    var reply = document.createElement("div");
    reply.className = "trip-reply smart-trip-reply";
    var toolbar = document.createElement("div");
    toolbar.className = "trip-reply-toolbar";
    var title = document.createElement("strong");
    title.textContent = query.toUpperCase() + " — UP TO 3 RELEVANT PICKS PER CATEGORY";
    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "trip-copy-btn";
    copy.textContent = "⧉ COPY LIST";
    copy.addEventListener("click", function () {
      var text = query.toUpperCase() + " — GEAR LIST\n\n" + groups.map(function (group) {
        return group.name + "\n" + group.items.map(function (product, index) {
          return (index + 1) + ". " + product.maker + " " + product.model + " — " + product.focus + "\n" + product.officialUrl;
        }).join("\n");
      }).join("\n\n");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
      copy.textContent = "✓ COPIED";
      setTimeout(function () { copy.textContent = "⧉ COPY LIST"; }, 1500);
    });
    toolbar.appendChild(title);
    toolbar.appendChild(copy);
    var groupWrap = document.createElement("div");
    groupWrap.className = "trip-linked-groups";
    groups.forEach(function (group) {
      var section = document.createElement("section");
      var heading = document.createElement("h3");
      heading.textContent = group.name + " — " + group.items.length + (group.items.length === 1 ? " PICK" : " PICKS");
      var links = document.createElement("div");
      group.items.forEach(function (product, index) {
        var link = document.createElement("a");
        link.href = product.officialUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        var name = document.createElement("strong");
        name.textContent = (index + 1) + ". " + product.maker + " " + product.model + " ↗";
        var reason = document.createElement("span");
        reason.textContent = product.focus;
        link.appendChild(name);
        link.appendChild(reason);
        links.appendChild(link);
      });
      section.appendChild(heading);
      section.appendChild(links);
      groupWrap.appendChild(section);
    });
    if (!groups.length) {
      var empty = document.createElement("p");
      empty.className = "smart-trip-empty";
      empty.textContent = "I do not have a defensible product match for that request yet. Try adding the activity and conditions instead of accepting irrelevant filler.";
      groupWrap.appendChild(empty);
    }
    reply.appendChild(toolbar);
    if (isDesignatedWildernessQuery(query)) {
      var rule = document.createElement("aside");
      rule.className = "wilderness-rule-alert";
      rule.innerHTML = "<strong>DESIGNATED WILDERNESS RULE CHECK</strong><span>Bob Marshall and other federally designated wilderness areas generally prohibit motor vehicles, motorized equipment, aircraft landings, and mechanical transport. Robots, drones, e-bikes, and wheeled carts were removed. Verify current orders with the managing agency before the trip.</span>";
      reply.appendChild(rule);
    }
    reply.appendChild(groupWrap);
    row.insertAdjacentElement("afterend", reply);
    scheduleRefresh();
  }

  function buildSmartTripList() {
    var input = document.querySelector(".trip-input");
    var active = document.querySelector(".sport-pill.active");
    var query = ((input && input.value) || (active && active.textContent) || "").trim();
    if (!query) return;
    var old = document.querySelector(".smart-trip-reply");
    if (old) old.remove();
    loadProductCatalog().then(function (products) {
      renderSmartTripList(query, recommendProducts(products, query));
    }).catch(function () {
      renderSmartTripList(query, []);
    });
  }

  function findChatTopic(question) {
    var lower = question.toLowerCase();
    return CHAT_TOPICS.find(function (topic) {
      return topic.words.some(function (word) { return lower.indexOf(word) !== -1; });
    }) || null;
  }

  function addChatMessage(container, role, text) {
    var message = document.createElement("div");
    message.className = "gear-chat-message gear-chat-" + role;
    message.textContent = text;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
    return message;
  }

  function visibleProductMatches(question, topic) {
    var terms = question.toLowerCase().split(/\s+/).filter(function (word) { return word.length > 2; });
    if (topic) terms = terms.concat(topic.words);
    return Array.prototype.slice.call(document.querySelectorAll(".product-card")).map(function (card) {
      var text = card.textContent.toLowerCase();
      var score = terms.reduce(function (total, term) { return total + (text.indexOf(term) !== -1 ? 1 : 0); }, 0);
      return { card: card, score: score };
    }).filter(function (entry) { return entry.score > 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 4);
  }

  function setReactInput(input, value) {
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function buildFullList(question) {
    var home = document.querySelector(".site-header .brand");
    if (home) home.click();
    var attempts = 0;
    var timer = setInterval(function () {
      attempts += 1;
      var input = document.querySelector(".trip-input");
      var button = document.querySelector(".trip-go");
      if (input && button) {
        clearInterval(timer);
        setReactInput(input, question);
        setTimeout(function () { button.click(); }, 80);
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (attempts > 20) {
        clearInterval(timer);
      }
    }, 100);
  }

  function speakChat(text, enabled) {
    if (!enabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(function (voice) { return /Samantha|Ava|Google US English|Microsoft Aria/i.test(voice.name); }) || voices.find(function (voice) { return /^en(-|_)/i.test(voice.lang); }) || null;
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  }

  function addBuildButton(assistant, query) {
    var build = document.createElement("button");
    build.type = "button";
    build.className = "gear-chat-build";
    build.textContent = "BUILD THE REASONED GEAR LIST ↗";
    build.addEventListener("click", function () { buildFullList(query); });
    assistant.appendChild(build);
  }

  function addReasonedProductLinks(assistant, products, query) {
    var groups = recommendProducts(products, query).slice(0, 8);
    if (!groups.length) return;
    var links = document.createElement("div");
    links.className = "gear-chat-links";
    groups.forEach(function (group) {
      var product = group.items[0];
      if (!product) return;
      var link = document.createElement("a");
      link.href = product.officialUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer sponsored";
      link.innerHTML = "<strong>" + group.name + ": " + product.maker + " " + product.model + " ↗</strong><span>WHY: " + product.focus + "</span>";
      links.appendChild(link);
    });
    assistant.appendChild(links);
  }

  function answerChat(question, messages, context) {
    context = context || {};
    addChatMessage(messages, "user", question);
    var topic = findChatTopic(question);
    var completeTrip = context.location && context.start && context.end;
    if (!completeTrip) {
      var intake = topic ? topic.reply + " " : "";
      intake += "Give me the nearest location and start/end dates above. I use those conditions—and any land-use constraints—to explain why each product earns a place.";
      if (isDesignatedWildernessQuery(question)) intake += " I also flagged this as designated wilderness, so mechanical transport, robots, drones, e-bikes, and wheeled carts will be excluded.";
      var intakeMessage = addChatMessage(messages, "assistant", intake);
      addBuildButton(intakeMessage, question);
      speakChat(intake, context.speak);
      return;
    }
    var loading = addChatMessage(messages, "assistant", "Checking the live forecast for " + context.location + " and turning the conditions into gear reasons…");
    getTripWeather(context.location, context.start, context.end).then(function (weather) {
      var decision = weatherDecision(weather);
      var ruleText = isDesignatedWildernessQuery(question + " " + context.location) ? " This is treated as designated wilderness: mechanical transport, robots, drones, e-bikes, and wheeled carts are excluded." : "";
      var reply = "For " + question + " near " + weather.place + ", " + decision.sentence + ruleText + " Every pick below is tied to the activity, forecast, or safety system—not filler.";
      loading.textContent = reply;
      var fullQuery = question + " " + context.location + " " + decision.reasons.join(" ");
      loadProductCatalog().then(function (products) {
        addReasonedProductLinks(loading, products, fullQuery);
        addBuildButton(loading, fullQuery);
        messages.scrollTop = messages.scrollHeight;
      });
      speakChat(reply, context.speak);
    }).catch(function (error) {
      var fallback = error.message + " I can still build an activity-based list, but I will not pretend it is weather-informed.";
      loading.textContent = fallback;
      addBuildButton(loading, question + " " + context.location);
      speakChat(fallback, context.speak);
    });
  }

  function weatherLabel(code) {
    if (code === 0) return "clear";
    if (code <= 3) return "partly cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 80 && code <= 82) return "rain showers";
    if (code >= 85 && code <= 86) return "snow showers";
    if (code >= 95) return "thunderstorms";
    return "mixed conditions";
  }

  function isoToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function maxForecastDate() {
    var date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().slice(0, 10);
  }

  function getTripWeather(location, start, end) {
    if (!location || !start || !end) return Promise.reject(new Error("Enter a location and both trip dates."));
    if (end < start) return Promise.reject(new Error("The end date must be after the start date."));
    if (start < isoToday()) return Promise.reject(new Error("Choose today or a future date."));
    if (start > maxForecastDate()) return Promise.reject(new Error("Exact forecasts are only available about 16 days ahead. Your trip details are saved; check again closer to departure."));
    var safeEnd = end > maxForecastDate() ? maxForecastDate() : end;
    var geocode = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(location) + "&count=1&language=en&format=json";
    return fetch(geocode).then(function (response) {
      if (!response.ok) throw new Error("Location search failed.");
      return response.json();
    }).then(function (data) {
      if (!data.results || !data.results.length) throw new Error("I could not find that location. Try a nearby town plus state or country.");
      var place = data.results[0];
      var forecast = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude + "&longitude=" + place.longitude + "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&start_date=" + start + "&end_date=" + safeEnd;
      return fetch(forecast).then(function (response) {
        if (!response.ok) throw new Error("Forecast data is not available for those dates yet.");
        return response.json();
      }).then(function (weather) {
        weather.place = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
        weather.latitude = place.latitude;
        weather.longitude = place.longitude;
        weather.partial = safeEnd !== end;
        return weather;
      });
    });
  }

  function weatherDecision(weather) {
    var daily = weather.daily || {};
    var highs = daily.temperature_2m_max || [];
    var lows = daily.temperature_2m_min || [];
    var rain = daily.precipitation_probability_max || [];
    var wind = daily.wind_speed_10m_max || [];
    var high = highs.length ? Math.max.apply(null, highs) : 0;
    var low = lows.length ? Math.min.apply(null, lows) : 0;
    var wet = rain.length ? Math.max.apply(null, rain) : 0;
    var gust = wind.length ? Math.max.apply(null, wind) : 0;
    var reasons = [];
    if (low <= 32) reasons.push("freezing lows make insulation, gloves, sleep-system margin, and protected batteries defensible");
    else if (low <= 45) reasons.push("cool lows justify a warm layer and weather-resistant sleep system");
    if (high >= 85) reasons.push("heat makes water capacity, electrolytes, ventilation, and sun protection higher priorities");
    if (wet >= 40) reasons.push("meaningful precipitation risk supports a shell, pack liner or dry bags, and protected electronics");
    if (gust >= 25) reasons.push("strong wind supports secure shelter, eye protection, and conservative route decisions");
    if (!reasons.length) reasons.push("the current forecast is moderate, so the list should prioritize core safety, navigation, hydration, and activity-specific essentials");
    return {
      high: high,
      low: low,
      rain: wet,
      wind: gust,
      reasons: reasons,
      sentence: "Forecast range: " + Math.round(low) + "–" + Math.round(high) + "°F, up to " + Math.round(wet) + "% precipitation probability, and about " + Math.round(gust) + " mph wind. That means " + reasons.join("; ") + "."
    };
  }

  function renderWeatherDays(weather, target) {
    target.textContent = "";
    var decision = weatherDecision(weather);
    var summary = document.createElement("p");
    summary.className = "weather-decision";
    summary.innerHTML = "<strong>GEAR REASONING</strong> " + decision.sentence;
    target.appendChild(summary);
    var grid = document.createElement("div");
    grid.className = "weather-days";
    (weather.daily.time || []).forEach(function (date, index) {
      var day = document.createElement("article");
      day.innerHTML = "<strong>" + date + "</strong><span>" + weatherLabel(weather.daily.weather_code[index]) + "</span><b>" + Math.round(weather.daily.temperature_2m_min[index]) + "–" + Math.round(weather.daily.temperature_2m_max[index]) + "°F</b><small>RAIN " + Math.round(weather.daily.precipitation_probability_max[index] || 0) + "% · WIND " + Math.round(weather.daily.wind_speed_10m_max[index] || 0) + " MPH</small>";
      grid.appendChild(day);
    });
    target.appendChild(grid);
    var source = document.createElement("p");
    source.className = "weather-source";
    source.innerHTML = "Forecast: Open-Meteo best-match models for <strong>" + weather.place + "</strong>. Planning aid only—check current agency alerts and official local forecasts before departure. <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://weather.com/weather/today/l/" + weather.latitude + "," + weather.longitude + "\">CHECK WEATHER.COM ↗</a>";
    target.appendChild(source);
  }

  function ensureWeatherPlanner() {
    var tools = document.querySelector(".my-list-tools");
    if (!tools || document.querySelector(".trip-weather-planner")) return;
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem("ggg-trip-weather") || "{}"); } catch (error) {}
    var box = document.createElement("section");
    box.className = "trip-weather-planner";
    box.innerHTML = "<div class=\"weather-heading\"><span>TRIP CONDITIONS</span><h2>Weather should change the gear list.</h2><p>Enter the nearest place and trip dates. Gear Guide checks the live forecast and explains which conditions change the recommendations.</p></div><form class=\"weather-form\"><label>LOCATION<input name=\"location\" required placeholder=\"Nearest town, state or country\"></label><label>START<input name=\"start\" type=\"date\" required></label><label>END<input name=\"end\" type=\"date\" required></label><button type=\"submit\">CHECK WEATHER + REASONS</button></form><div class=\"weather-output\" aria-live=\"polite\"></div>";
    var form = box.querySelector("form");
    form.elements.location.value = saved.location || "";
    form.elements.start.min = isoToday();
    form.elements.end.min = isoToday();
    form.elements.start.value = saved.start || "";
    form.elements.end.value = saved.end || "";
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var location = form.elements.location.value.trim();
      var start = form.elements.start.value;
      var end = form.elements.end.value;
      localStorage.setItem("ggg-trip-weather", JSON.stringify({ location: location, start: start, end: end }));
      var output = box.querySelector(".weather-output");
      output.textContent = "CHECKING LIVE FORECAST…";
      getTripWeather(location, start, end).then(function (weather) { renderWeatherDays(weather, output); }).catch(function (error) { output.textContent = error.message; });
    });
    tools.insertAdjacentElement("afterend", box);
  }

  function ensureGlobalChatbot() {
    if (document.querySelector(".gear-chat-widget")) return;
    var widget = document.createElement("aside");
    widget.className = "gear-chat-widget";
    widget.setAttribute("aria-label", "Gear Guru chatbot");
    var panel = document.createElement("section");
    panel.className = "gear-chat-panel";
    panel.hidden = true;
    var header = document.createElement("div");
    header.className = "gear-chat-header";
    var title = document.createElement("strong");
    title.textContent = "ASK GEAR GURU";
    var close = document.createElement("button");
    close.type = "button";
    close.textContent = "✕";
    close.setAttribute("aria-label", "Close Gear Guru chatbot");
    header.appendChild(title);
    header.appendChild(close);
    var messages = document.createElement("div");
    messages.className = "gear-chat-messages";
    addChatMessage(messages, "assistant", "Tell me what you’re doing, the nearest location, and your dates. I’ll check the forecast, apply land-use rules, and explain why each piece of gear belongs.");
    var contextBox = document.createElement("div");
    contextBox.className = "gear-chat-context";
    contextBox.innerHTML = "<label>NEAREST LOCATION<input name=\"chat-location\" placeholder=\"Town, state or country\"></label><div><label>START<input name=\"chat-start\" type=\"date\"></label><label>END<input name=\"chat-end\" type=\"date\"></label></div>";
    var contextLocation = contextBox.querySelector("[name=chat-location]");
    var contextStart = contextBox.querySelector("[name=chat-start]");
    var contextEnd = contextBox.querySelector("[name=chat-end]");
    contextStart.min = isoToday();
    contextEnd.min = isoToday();
    try {
      var savedTrip = JSON.parse(localStorage.getItem("ggg-trip-weather") || "{}");
      contextLocation.value = savedTrip.location || "";
      contextStart.value = savedTrip.start || "";
      contextEnd.value = savedTrip.end || "";
    } catch (error) {}
    var form = document.createElement("form");
    form.className = "gear-chat-form";
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "What are you doing and what matters?";
    input.setAttribute("aria-label", "Question for Gear Guru");
    var mic = document.createElement("button");
    mic.type = "button";
    mic.className = "gear-chat-mic";
    mic.textContent = "MIC";
    mic.setAttribute("aria-label", "Speak to Gear Guide");
    var voice = document.createElement("button");
    voice.type = "button";
    voice.className = "gear-chat-voice";
    voice.textContent = "VOICE OFF";
    voice.setAttribute("aria-pressed", "false");
    voice.addEventListener("click", function () {
      var enabled = voice.getAttribute("aria-pressed") !== "true";
      voice.setAttribute("aria-pressed", String(enabled));
      voice.textContent = enabled ? "VOICE ON" : "VOICE OFF";
      if (!enabled && window.speechSynthesis) window.speechSynthesis.cancel();
    });
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      var recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.addEventListener("start", function () { mic.textContent = "LISTENING…"; mic.classList.add("is-listening"); });
      recognition.addEventListener("end", function () { mic.textContent = "MIC"; mic.classList.remove("is-listening"); });
      recognition.addEventListener("result", function (event) {
        input.value = event.results[0][0].transcript;
        input.focus();
      });
      mic.addEventListener("click", function () { try { recognition.start(); } catch (error) {} });
    } else {
      mic.disabled = true;
      mic.textContent = "NO MIC";
      mic.title = "Speech recognition is not supported by this browser.";
    }
    var send = document.createElement("button");
    send.type = "submit";
    send.textContent = "SEND";
    form.appendChild(input);
    form.appendChild(mic);
    form.appendChild(send);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var question = input.value.trim();
      if (!question) return;
      input.value = "";
      var trip = { location: contextLocation.value.trim(), start: contextStart.value, end: contextEnd.value, speak: voice.getAttribute("aria-pressed") === "true" };
      localStorage.setItem("ggg-trip-weather", JSON.stringify(trip));
      answerChat(question, messages, trip);
    });
    panel.appendChild(header);
    panel.appendChild(contextBox);
    panel.appendChild(messages);
    panel.appendChild(voice);
    panel.appendChild(form);
    var launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "gear-chat-launcher";
    launcher.setAttribute("aria-expanded", "false");
    launcher.innerHTML = "<span aria-hidden=\"true\">GG</span><strong>ASK GEAR GURU</strong>";
    function setOpen(open) {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      if (open) setTimeout(function () { input.focus(); }, 0);
    }
    launcher.addEventListener("click", function () { setOpen(panel.hidden); });
    close.addEventListener("click", function () { setOpen(false); });
    widget.appendChild(panel);
    widget.appendChild(launcher);
    document.body.appendChild(widget);
  }

  function changeQuantity(key, difference) {
    var list = currentList();
    var changed = list.map(function (item) {
      if (itemIdentity(item) !== key) return item;
      return Object.assign({}, item, { qty: Math.max(1, (Number(item.qty) || 1) + difference) });
    });
    writeMyList(changed);
    scheduleRefresh();
  }

  function ensureListTools() {
    var hero = document.querySelector(".hub-hero");
    if (!hero || hero.textContent.indexOf("MY GEAR LIST") === -1) return;
    var description = hero.querySelector("p:last-child");
    if (description && description.textContent.indexOf("months later") !== -1) {
      description.textContent = "Your personal list is saved on this device, so it will still be here when you return in this browser.";
    }
    var tabs = document.querySelector(".list-tabs");
    if (!tabs || tabs.parentNode.querySelector(".my-list-tools")) return;
    var tools = document.createElement("div");
    tools.className = "my-list-tools";
    var label = document.createElement("p");
    label.textContent = "NO ACCOUNT REQUIRED — YOUR PICKS STAY SAVED ON THIS DEVICE.";
    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "button button-bright";
    copy.textContent = "⧉ COPY MY LIST";
    copy.addEventListener("click", function () {
      var text = listAsText(currentList());
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
      copy.textContent = "✓ LIST COPIED";
      setTimeout(function () { copy.textContent = "⧉ COPY MY LIST"; }, 1600);
    });
    var print = document.createElement("button");
    print.type = "button";
    print.className = "button button-outline print-list-btn";
    print.textContent = "PRINT MY LIST";
    print.addEventListener("click", function () {
      window.print();
    });
    tools.appendChild(label);
    tools.appendChild(copy);
    tools.appendChild(print);
    tabs.insertAdjacentElement("afterend", tools);
  }

  function refresh() {
    scheduled = false;
    ensureHeaderLink();
    ensureBrandIdentity();
    fixHeadline();
    ensureTripBuilderExpansion();
    ensureTripSaveButton();
    ensureListTools();
    ensureWeatherPlanner();
    ensureAmazonAffiliateLinks();
    ensureProductControls();
    normalizeTypography();
    enforceHomepageSectionOrder();
    improveFieldNotes();
    ensureGlobalChatbot();
    updateCounts();
  }

  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(refresh);
  }

  document.addEventListener("click", function (event) {
    var tripGo = event.target.closest && event.target.closest(".trip-go");
    if (tripGo) {
      event.preventDefault();
      event.stopPropagation();
      buildSmartTripList();
      return;
    }
    var quantityButton = event.target.closest && event.target.closest(".qty-minus, .qty-plus");
    if (quantityButton) {
      event.preventDefault();
      event.stopPropagation();
      var quantityControl = quantityButton.closest(".quantity-control");
      changeQuantity(quantityControl.dataset.listKey, quantityButton.classList.contains("qty-plus") ? 1 : -1);
      return;
    }
    var add = event.target.closest && event.target.closest(".add-list-btn");
    if (add) {
      if (add.classList.contains("is-saved")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      setTimeout(function () {
        writeMyList(readList(MAIN_KEY).concat(readList(MY_LIST_KEY)));
      }, 50);
    }
    var remove = event.target.closest && event.target.closest(".share-btn");
    if (remove && /REMOVE/i.test(remove.textContent)) {
      setTimeout(function () {
        writeMyList(readList(MY_LIST_KEY));
      }, 50);
    }
    scheduleRefresh();
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target && event.target.matches(".trip-input")) {
      event.preventDefault();
      event.stopPropagation();
      buildSmartTripList();
    }
  }, true);

  window.addEventListener("storage", scheduleRefresh);
  new MutationObserver(scheduleRefresh).observe(document.documentElement, { childList: true, subtree: true });
  mergeSavedLists();
  scheduleRefresh();
}());
