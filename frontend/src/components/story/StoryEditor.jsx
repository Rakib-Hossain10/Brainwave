
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  useEdgesState,
  useNodesState,
  MiniMap,
  Controls,
} from "reactflow";
import { uid } from "../../utils/uid";
import StoryNode from "./StoryNode";
import StoryNodeEditor from "./StoryNodeEditor";

// helpers 
const shallowEqualArr = (a, b) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

// initial demo graph
const initialNodes = [
  {
    id: "root",
    type: "storyNode",
    position: { x: 110, y: 50 },
    data: {
      title: "1. root",
      content: "剧情分支管理起点。",
      accent: "violet",
    },
  },
  {
    id: "start-1",
    type: "storyNode",
    position: { x: 110, y: 195 },
    data: {
      title: "1. 开局1",
      content:
        "在宫殿门前，风声未起。你将如何开启第一幕？（点击节点“✎编辑”可填写更长文案）",
      accent: "rose",
    },
  },
];

const initialEdges = [
  { id: "e-root-start1", source: "root", target: "start-1", animated: true },
];

const nodeTypes = { storyNode: StoryNode };

export default function StoryEditor() {
  // graph state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // UI state
  const [editingNode, setEditingNode] = useState(null);
  const [connectFrom, setConnectFrom] = useState(null);

  // selection state for right panel
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState([]);

  // ---------- SAVE: stable callback + effect ----------
  const handleSave = useCallback(() => {
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        x: n.position.x,
        y: n.position.y,
        title: n.data.title,
        content: n.data.content,
        accent: n.data.accent,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    // TODO: replace with axios.post(`/api/stories/${charId}/graph`, payload)
    console.log("STORY SAVE", payload);
    alert("已保存（查看控制台）。上线时在此发请求到 /api/stories/:characterId/graph");
  }, [nodes, edges]);

  useEffect(() => {
    document.addEventListener("story:save", handleSave);
    return () => document.removeEventListener("story:save", handleSave);
  }, [handleSave]);

  // ---------- helpers ----------
  const getLastNode = useCallback(() => {
    if (nodes.length === 0) return null;
    return nodes.reduce(
      (m, n) => (n.position.y > m.position.y ? n : m),
      nodes[0]
    );
  }, [nodes]);

  const addNode = useCallback(
    (opts = {}) => {
      const base = opts.baseNode || getLastNode();
      const newId = uid("node");
      const position = base
        ? { x: base.position.x, y: base.position.y + 200 }
        : { x: 120, y: 80 };

      const data = {
        title: opts.title || "新节点",
        content: opts.content || "输入剧情…",
        accent: opts.accent || "amber",
      };

      const newNode = { id: newId, type: "storyNode", position, data };
      setNodes((nds) => [...nds, newNode]);

      // auto-connect from explicit source
      if (opts.connectFromId) {
        setEdges((eds) => [
          ...eds,
          {
            id: uid("e"),
            source: opts.connectFromId,
            target: newId,
            animated: true,
          },
        ]);
      } else if (connectFrom && connectFrom !== newId) {
        // or from connect mode
        setEdges((eds) => [
          ...eds,
          { id: uid("e"), source: connectFrom, target: newId, animated: true },
        ]);
        setConnectFrom(null);
      }
      return newId;
    },
    [connectFrom, setNodes, setEdges, getLastNode]
  );

  const duplicateNode = useCallback(
    (node) => {
      if (!node) return;
      const newId = addNode({
        baseNode: node,
        title: node.data.title,
        content: node.data.content,
        accent: node.data.accent,
        connectFromId: node.id,
      });
      return newId;
    },
    [addNode]
  );

  // connect mode handlers
  const handleStartConnect = useCallback((nodeId) => setConnectFrom(nodeId), []);
  const handlePickTarget = useCallback(
    (targetId) => {
      if (!connectFrom || connectFrom === targetId) return;
      setEdges((eds) => [
        ...eds,
        { id: uid("e"), source: connectFrom, target: targetId, animated: true },
      ]);
      setConnectFrom(null);
    },
    [connectFrom, setEdges]
  );

  // edit handlers
  const handleEdit = useCallback((node) => setEditingNode(node), []);
  const closeEditor = useCallback(() => setEditingNode(null), []);
  const saveNode = useCallback(
    (patch) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === patch.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  title: patch.title,
                  content: patch.content,
                  accent: patch.accent || n.data.accent,
                },
              }
            : n
        )
      );
    },
    [setNodes]
  );

  // delete selected node(s)/edge(s)
  const deleteSelected = useCallback(() => {
    if (selectedNodeIds.length) {
      setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
      setEdges(
        (eds) =>
          eds.filter(
            (e) =>
              !selectedNodeIds.includes(e.source) &&
              !selectedNodeIds.includes(e.target)
          )
      );
      setSelectedNodeIds([]);
    }
    if (selectedEdgeIds.length) {
      setEdges((eds) => eds.filter((e) => !selectedEdgeIds.includes(e.id)));
      setSelectedEdgeIds([]);
    }
  }, [selectedNodeIds, selectedEdgeIds, setNodes, setEdges]);

  // duplicate helpers
  const duplicateLast = useCallback(
    () => duplicateNode(getLastNode()),
    [duplicateNode, getLastNode]
  );
  const duplicateSelected = useCallback(() => {
    const node = nodes.find((n) => n.id === selectedNodeIds[0]);
    duplicateNode(node);
  }, [nodes, selectedNodeIds, duplicateNode]);

  // stable selection handler (prevents update loop)
  const handleSelectionChange = useCallback((sel) => {
    const nextNodeIds = (sel?.nodes || []).map((n) => n.id);
    const nextEdgeIds = (sel?.edges || []).map((e) => e.id);

    setSelectedNodeIds((prev) =>
      shallowEqualArr(prev, nextNodeIds) ? prev : nextNodeIds
    );
    setSelectedEdgeIds((prev) =>
      shallowEqualArr(prev, nextEdgeIds) ? prev : nextEdgeIds
    );
  }, []);

  // attach handlers into node data (memoized)
  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          connecting: connectFrom === n.id,
          inConnectMode: !!connectFrom,
          onStartConnect: () => handleStartConnect(n.id),
          onPickTarget: () => handlePickTarget(n.id),
          onEdit: () => handleEdit(n),
        },
      })),
    [nodes, connectFrom, handleStartConnect, handlePickTarget, handleEdit]
  );

  return (
    <div className="relative h-[calc(100dvh-56px)]">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={handleSelectionChange}
        fitView
        panOnDrag
        zoomOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={18} size={1} color="#ffffff22" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          style={{ background: "rgba(255,255,255,0.02)" }}
        />
      </ReactFlow>

      {/* bottom add button (mobile primary) */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center md:hidden">
        <button
          onClick={() => addNode()}
          className="rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 text-sm"
        >
          ＋ 添加剧情节点
        </button>
      </div>

      {/* right actions panel (desktop & tablets) */}
      {/* actions panel: centered on mobile; compact top-right on desktop */}
<aside
  className="
    absolute z-30
    top-2 left-1/2 -translate-x-1/2            /* mobile: top middle */
    w-[calc(100%-16px)] max-w-[640px]          /* mobile width with margins */
    rounded-2xl border border-white/10 bg-black/50 backdrop-blur
    px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]

    md:top-3 md:right-3 md:left-auto md:translate-x-0  /* desktop: top-right */
    md:w-[18rem] md:max-w-none                         /* <-- shrink on desktop */
    md:rounded-xl md:px-3 md:py-2 md:shadow-lg
  "
>
  <div className="text-xs text-white/70 mb-2 text-center md:text-left">操作</div>

  <div className="grid grid-cols-2 gap-2 w-full md:grid-cols-1 md:gap-1.5">
    <button
      className="
        px-3 py-2 rounded-lg text-sm
        border border-white/10 bg-white/10 hover:bg-white/15
        focus:outline-none focus:ring-2 focus:ring-white/20
        md:py-1.5 md:text-xs
      "
      onClick={() => addNode()}
    >
      ＋ 新建节点
    </button>

    <button
      className={`
        px-3 py-2 rounded-lg text-sm transition
        border focus:outline-none focus:ring-2
        ${connectFrom
          ? "bg-emerald-400 text-black border-emerald-300 hover:bg-emerald-300 focus:ring-emerald-300/40"
          : "bg-white/10 hover:bg-white/15 border-white/10 text-white focus:ring-white/20"}
        md:py-1.5 md:text-xs
      `}
      onClick={() =>
        setConnectFrom(
          connectFrom ? null : selectedNodeIds[0] || getLastNode()?.id
        )
      }
      title="选择一个源节点后再点目标节点"
    >
      ↪ 连线
    </button>

    <button
      className="
        px-3 py-2 rounded-lg text-sm
        border border-white/10 bg-white/10 hover:bg-white/15
        focus:outline-none focus:ring-2 focus:ring-white/20
        md:py-1.5 md:text-xs
      "
      onClick={duplicateLast}
    >
      ⎘ 复制最后节点
    </button>

    <button
      className="
        px-3 py-2 rounded-lg text-sm
        border border-white/10 bg-white/10 hover:bg-white/15
        disabled:opacity-50
        focus:outline-none focus:ring-2 focus:ring-white/20
        md:py-1.5 md:text-xs
      "
      disabled={!selectedNodeIds.length}
      onClick={duplicateSelected}
    >
      ⎘ 复制所选并相连
    </button>

    <button
      className="
        px-3 py-2 rounded-lg text-sm
        border border-rose-400/30
        bg-rose-500/80 hover:bg-rose-500
        text-white disabled:opacity-50
        focus:outline-none focus:ring-2 focus:ring-rose-300/50
        md:py-1.5 md:text-xs
      "
      disabled={!selectedNodeIds.length && !selectedEdgeIds.length}
      onClick={deleteSelected}
    >
      🗑 删除选中
    </button>
  </div>
</aside>


      {/* node editor (bottom sheet mobile / modal desktop) */}
      <StoryNodeEditor
        open={!!editingNode}
        node={editingNode}
        onClose={closeEditor}
        onSave={saveNode}
      />
    </div>
  );
}
