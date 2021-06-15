var s = document.getElementById("source");
const pageArr = s.innerText
  .replace(/^\s+|\n/gm, "")
  .split("###### ")
  .slice(1);

var titleArr = [];

pageArr.forEach((pageText, index) => {
  var contentObj = {};
  var regx = RegExp(
    /(?<l1Title>[\w@\s\.\-]*)(\[\[source\]\].*)*###\s*(?<l2Title>[\w/\s]*):*(<p>.*<\/p>)*(#####)*\s*(?<l3Title>[\w\s/]*)*:*.*/,
    "g"
  );
  var result = regx.exec(pageText);
  contentObj.pageIndex = index + 2;
  contentObj.l1Title = result.groups.l1Title;
  contentObj.l2Title = result.groups.l2Title;
  contentObj.l3Title = result.groups.l3Title;
  titleArr.push(contentObj);
});

var titleObj = {};
titleArr.forEach((ele) => {
  titleObj[ele.l3Title] = { parent: ele.l2Title, pageIndex: ele.pageIndex };
  titleObj[ele.l2Title] = { parent: ele.l1Title, pageIndex: ele.pageIndex };
  titleObj[ele.l1Title] = { parent: "root", pageIndex: ele.pageIndex };
});
// console.log("titleObj", titleObj);

var titleArr2 = Object.keys(titleObj).map((ele, index) => {
  return {
    pageIndex: titleObj[ele]["pageIndex"],
    name: ele,
    parent: titleObj[ele]["parent"],
  };
});
console.log(titleArr2);
titleArr2.push({
  index: undefined,
  name: "root",
  parent: undefined,
});
// console.log("titleArr2", titleArr2);

const idMapping = titleArr2.reduce((acc, el, i) => {
  acc[el.name] = i;
  return acc;
}, {});

// console.log("idMapping", idMapping);

let root;
titleArr2.forEach((el) => {
  if (el.parent == undefined) {
    root = el;
    return;
  }
  // console.log("-------");
  // console.log("el", el);
  // console.log("el.parent", el.parent);
  // console.log("idMapping[el.parent]", idMapping[el.parent]);
  const parentEl = titleArr2[idMapping[el.parent]];
  // console.log("parentEl", parentEl);
  parentEl["children"] = [...(parentEl["children"] || []), el];
});
// console.log(root);

// function render (data){
//   if (data.children){
//     render(data.children)
//   } else {

//     return
//   }
// }

var renderContent = root.children
  .map(
    (topLevel) =>
      `<button class="accordion">${topLevel.name}</button>
    <div class="panel">
      <ul>
        ${topLevel.children
          .map(
            (secondLevel) => `<li><a href="#${secondLevel.pageIndex}">${
              secondLevel.name
            }</a>
            <ul>
              ${
                secondLevel.hasOwnProperty("children")
                  ? secondLevel.children
                      .map(
                        (thirdLevel) =>
                          `<li><a href="#${thirdLevel.pageIndex}">${thirdLevel.name}</a></li>`
                      )
                      .join("")
                  : ``
              }
            </ul>
          </li>
          `
          )
          .join("")}
      </ul>
    </div>`
  )
  .join("");

//   <button class="accordion"></button>
//     <div class="panel" style="height: auto">
//     <ul>
//       <li>
//         <a href="#2">Layout Works </a>
//         <ul>
//           <li><a href="#6">Situation </a></li>
//           <li><a href="#7">Idea </a></li>
//         </ul>
//       </li>
//     </ul>
// `;

document.getElementById("navIndex").innerHTML = renderContent;
// console.log(document.getElementById("navIndex").innerHTML);
// uniq = [...new Set(titleArr)];

// var seen = {};
// var l1TitleList = titleArr.filter((ele, index) => {
//   return seen.hasOwnProperty(ele) ? false : (seen[ele] = true);
// });
// console.log(l1TitleList);
