function accordionView(activePanelArr, panelTarget) {
  if (activePanelArr.length > 0) {
    activePanelArr[0].style.height = "0";
    console.log(activePanelArr[0].style.height);
    activePanelArr.splice(0);
  }
  panelTarget.style.height = "auto";
  panelTarget.style.overflow = "scroll";
  activePanelArr.push(panelTarget);
}

function bindAccordionClickEvent() {
  const acc = document.getElementsByClassName("accordion");
  const activePanelArr = [];

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      accordionView(activePanelArr, this.nextElementSibling);
    });
  }
}

function highLightItem(node) {
  const current = Number(window.location.hash.slice(1));
  let distance = 0;
  let closest = current;
  let closestNode = "";
  // if (window.location.hash === targetHash) return;
  function findClosetDom(node) {
    const item = Number(node.getAttribute("href").slice(1));
    console.log("node", node);
    distance = current - item;
    if (distance < closest && distance >= 0) {
      closest = distance;
      closestNode = node;
    }
  }
  function allDescendants(node) {
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      if (child.getAttribute("href")) {
        findClosetDom(child);
      } else {
        allDescendants(child);
      }
    }
  }
  allDescendants(node);
  return closestNode;
}

function bindPanelClickEvent() {
  // const pan = document.querySelector(".panel");
  // console.log("pan", pan);
  const targetHash = "#1";
  window.addEventListener("hashchange", function (e) {
    console.log("e", e);
    // highLightItem(e.newURL.split("#")[1]);
    console.log("e hash change");
  });

  document.querySelector("#navIndex").addEventListener("click", function (e) {
    // console.log(highLightItem(e.target));
    console.log("a", "cliek");
    console.log(e.target);
  });
}

function main() {
  bindAccordionClickEvent();
  bindPanelClickEvent();
}

main();
