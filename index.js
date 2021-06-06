function updatePanel(onArray, panel) {
  if (onArray.length > 0) {
    onArray[0].style.height = "0";
    onArray.splice(0);
  }
  onArray.push(panel);

  if (panel.style.height === "auto") {
    panel.style.height = "0";
  } else {
    panel.style.height = "auto";
  }
}

function listenClickEventinNav() {
  const acc = document.getElementsByClassName("accordion");
  let panel = "";
  const onArray = [];

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      updatePanel(onArray, this.nextElementSibling);
    });
  }
}

function highLightClosestContent() {
  const pan = document.getElementsByClassName("panel");
  function createGetClosetNode() {
    const storedHash = "#1";
    return function () {
      if (window.location.hash === storedHash) return;
      const current = Number(window.location.hash.slice(1));
      let distance = 0;
      let closest = current;
      let closestNode = "";

      function getClosestNode(node) {
        const item = Number(node.getAttribute("href").slice(1));
        distance = current - item;
        if (distance < closest && distance >= 0) {
          closest = distance;
          closestNode = node;
        }
      }

      function allDescendants(node) {
        for (let i = 0; i < node.children.length; i++) {
          let child = node.children[i];
          let dom = "";
          if (child.getAttribute("href")) {
            getClosestNode(child);
          } else {
            allDescendants(child);
          }
        }
      }

      for (let i = 0; i < pan.length; i++) {
        allDescendants(pan[i]);
      }
      return closestNode;
    };
  }

  const getClosetNode = createGetClosetNode();
  let closestNode = getClosetNode();
  const onArray = [];

  function updateClassBetweenItem() {
    console.log(closestNode);
    //if (closestNode) {
    //  closestNode.classList.remove("closet");
    // }
    closestNode = getClosetNode();
    if (closestNode) {
      closestNode.classList.add("closet");
      updatePanel(
        onArray,
        closestNode.parentElement.parentElement.parentElement
      );
    }
    if (closestNode) {
      closestNode.classList.add("closet");
    }
    // window.requestAnimationFrame(updateClassBetweenItem);
  }

  window.requestAnimationFrame(updateClassBetweenItem);
}

listenClickEventinNav();
highLightClosestContent();
