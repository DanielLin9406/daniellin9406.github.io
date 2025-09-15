const getPage = () => {
  const sourceInnerText = document.getElementById("source").innerText
  const pageArr = sourceInnerText.replace(/^\s+|\n/gm, "").split("###### ").slice(1)

  // ### [l1Title]
  // #### [l2Title]
  // ### [l2Title]: [l3Title]
  return pageArr.reduce((acc, pageText, i) => {
    const result = /(?<l1Title>[\w@\s\.\-\(\)\d]*)(\[\[source\]\]\([^)]*\)|\[\[blog\]\]\([^)]*\)|\[<a href=".*" target="_blank">[^<]+<\/a>\])*###\s*(?<l2Title>[\w/\s-]*):*(<p>.*<\/p>)*(####)*\s*(?<l3Title>[\w\s/]*)*:*.*/g.exec(pageText);

    acc.push({
      pageIndex: i + 2,
      l1Title: result?.groups?.l1Title,
      l2Title: result?.groups?.l2Title,
      l3Title: result?.groups?.l3Title
    });
    return acc
  }, [])
}

const generateOutline = () => {
  // console.log('getPage()', getPage())
  const titleObj = getPage().reduce((acc, cur, i) => {
    acc[cur.l3Title] = { parent: cur.l2Title, pageIndex: cur.pageIndex };
    acc[cur.l2Title] = { parent: cur.l1Title, pageIndex: cur.pageIndex };
    acc[cur.l1Title] = { parent: "root", pageIndex: cur.pageIndex };
    return acc
  }, {})
  
  const titleArr = Object.keys(titleObj).reduce((acc, ele, index) => {
    if (ele && ele !== 'undefined') {
      acc.push({
        pageIndex: titleObj[ele]["pageIndex"],
        name: ele,
        parent: titleObj[ele]["parent"],
      })
    }
    return acc
  }, [{
    pageIndex: undefined,
    name: "root",
    parent: undefined,
  }]);

  const idMapping = titleArr.reduce((acc, el, i) => {
    acc[el.name] = i;
    return acc;
  }, {});
  
  const { root } = titleArr.reduce((acc, el) => {
    if (el.parent === undefined) {
      acc.root = el;
    } else {
      const parentEl = titleArr[idMapping[el.parent]];
      parentEl.children = parentEl.children || [];
      parentEl.children.push(el);
    }
    return acc;
  }, { root: null });
  return root
}

const render = (root, dom) => {
  const renderUList = (node) => {
    if (!node.children) return ''
    return `
      <ul>
        ${node.children.map((n) => `
          <li><a href="#${n.pageIndex}" onclick="event.stopPropagation();">${n.name}</a>${renderUList(n)}</li>
        `).join('')}
      </ul>
    `
  }

  dom.innerHTML = root.children.map((node) => `
    <div class="panel">
      <button class="accordion">${node.name}</button>
      <div class="scroll-con" data-id=${node.pageIndex}>${renderUList(node)}</div>
    </div>
  `).join('')
}

const bindAccordionClickEvent = (activePanelArr, dom) => {
  const addTrack = (active) => {
    active.style.height = "auto";
    active.style.overflowY = "scroll";      
    activePanelArr.push({
      id: active.dataset.id,
      dom: active,
    })     
  }
  const accordionView = (activePanelArr, panelTarget) => {
    const dom = panelTarget.lastElementChild
    if (activePanelArr.length > 0) {
      lastClicked = activePanelArr.pop()
      lastClicked.dom.style.height = "0";
      if (dom.dataset.id !== lastClicked.id) {
        addTrack(dom)
      }
    } else {
      addTrack(dom)
    }
  }

  for (let i = 0; i < dom.length; i++) {
    dom[i].addEventListener("click", function (e) {
      accordionView(activePanelArr, this);
    });
  }
}
// TODO
const highLightItem = (node) => {
  const current = Number(window.location.hash.slice(1));
  let distance = 0;
  let closest = current;
  let closestNode = "";
  // if (window.location.hash === targetHash) return;
  function findClosetDom(node) {
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

const bindPanelClickEvent = (activePanelArr) => {
  const targetHash = "#1";
  window.addEventListener("hashchange", function (e) {
    // highLightItem(e.newURL.split("#")[1]);
    // console.log("e hash change");
  });

  
  document.querySelector("#navIndex").addEventListener("click", function (e) {
    // console.log(e.target);
  });

  // prevent go-to-next page action on nav
  document.querySelector("#navIndex").addEventListener("touchend", function (e) {
    e.stopPropagation()
  });  
  document.querySelector("#navIndex").addEventListener("onscroll", function (e) {
    e.preventDefault()
  });  
}

// 基本反爬蟲檢測
function antiBot() {
  // 檢測是否為無頭瀏覽器
  if (navigator.webdriver || 
      window.navigator.webdriver || 
      window.callPhantom || 
      window._phantom ||
      window.__nightmare ||
      window.Buffer) {
    document.body.innerHTML = '<h1>Access Denied</h1>';
    return false;
  }
  
  // 檢測開發者工具
  let devtools = {
    open: false,
    orientation: null
  };
  
  setInterval(function() {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log('%c⚠️ Developer Console Detected', 'color: red; font-size: 20px; font-weight: bold;');
      }
    } else {
      devtools.open = false;
    }
  }, 500);
  
  return true;
}

function main() {
  // 執行反爬蟲檢測
  if (!antiBot()) {
    return;
  }
  
  render(generateOutline(), document.getElementById("navIndex"));

  const activePanelArr = [];
  bindAccordionClickEvent(activePanelArr, document.getElementsByClassName("panel"));
  bindPanelClickEvent(activePanelArr);
}

// 防止右鍵和快捷鍵
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

document.addEventListener('keydown', function(e) {
  // 防止 F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.key === 'u') ||
      (e.ctrlKey && e.key === 's')) {
    e.preventDefault();
    return false;
  }
});

// 防止選取文字
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
  return false;
});

main();