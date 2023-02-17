import "/node_modules/react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useLocalStorage } from "react-use";
import './style.css'

const ResponsiveRGL = WidthProvider(Responsive);

let dragging = false;
let type;

const getDroppableProp = (t) => ({
  draggable: true,
  unselectable: "on",
  onDragStart() {
    type = t;
  }
  // onDragStop() {}
});
const Droppables = () => (
  <aside>
    {/* <div {...getDroppableProp("GRID")}>GRID</div> */}
    <div {...getDroppableProp("CHART")}>Produto unico</div>
  </aside>
);
export default function App() {
  const [currBreakpoint, setCurrBreakpoint] = useState("lg");
  const [panels2, setPanels2] = useLocalStorage("panels2", []);
  const [layouts2, setLayouts2] = useLocalStorage("layouts2");
  // console.log(panels2, layouts2);

  const handleLayouts2 = (newLayouts2) => {
    if (!dragging) setLayouts2(newLayouts2);
  };

  const handleDelete = ({ target: { id } }) => {
    setPanels2(panels2.filter((panel) => panel.i !== id));
    handleLayouts2(
      Object.entries(layouts2).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value.filter((layout) => layout.i !== id)
        };
      }, {})
    );
  };

  const handleDrop = (layout, layoutItem, _event) => {
    dragging = false;

    if (layoutItem) {
      setPanels2([
        ...panels2,
        {
          ...layoutItem,
          type
        }
      ]);
      handleLayouts2({ ...layouts2, [currBreakpoint]: layout });
    }
  };

  return (
    <>
      <Droppables />
      <div className="campo-drag">
      <ResponsiveRGL
        autoSize={false}
        //compactType="vertical horizontal"
        compactType="vertical"
        containerPadding={[10, 0]}
        draggableHandle=".draggable-handle"
        //isBounded
        margin={[4, 4]}
        // eliminate resizing animation on component mount
        measureBeforeMount={true}
        resizeHandles={["se", "e", "s"]} //Representam as setas de controlar o tamanho
        rowHeight={60}
        // LAYOUTs2
        layouts={layouts2}
        onLayoutChange={(_, newLayouts2) => handleLayouts2(newLayouts2)}
        onBreakpointChange={(breakpoint) => setCurrBreakpoint(breakpoint)}
        // DROPS
        isDroppable={true}
        droppingItem={{ i: nanoid(), w: 7, h: 7, minW: 3, minH: 2 }}
        onDrop={handleDrop}
        // DRAGS
        onDragStart={() => (dragging = true)}
        onDragStop={() => (dragging = false)}

      >
        {panels2.map(({ i, type, ...grid }) => {

          return (
            <div key={i} data-grid={grid} className='container-elementos'>
              <header className="header-elementos">
                <h2>{type}</h2>
                <button className="draggable-handle">&#10021;</button>
                <button className="delete-button" id={i} onClick={handleDelete}>
                  &#x2715;
                </button>

              </header>
              <div className="charts-elementos">
                <h1>Teste</h1>
              </div>
            </div>

          )
        })}

      </ResponsiveRGL>
      

      {panels2.length < 1 && <em>DROP ITEMS HERE</em>}

      </div>
    </>
  );
}

