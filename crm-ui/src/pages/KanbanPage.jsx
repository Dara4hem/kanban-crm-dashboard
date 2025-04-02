import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchLeads, updateLeadStage } from "../api/leads";
import { useNavigate } from "react-router-dom";

const stages = ["new", "contacted", "qualified", "won", "lost"];
const stageLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

const getColor = (stage) => {
  switch (stage) {
    case "new": return "#0d6efd";
    case "contacted": return "#0dcaf0";
    case "qualified": return "#ffc107";
    case "won": return "#198754";
    case "lost": return "#dc3545";
    default: return "#6c757d";
  }
};

const KanbanPage = () => {
  const navigate = useNavigate();
  const socket = useRef(null);
  const [leads, setLeads] = useState({
    new: [], contacted: [], qualified: [], won: [], lost: [],
  });

  const loadLeads = async () => {
    try {
      const data = await fetchLeads();
      const organized = { new: [], contacted: [], qualified: [], won: [], lost: [] };
      data.forEach((lead) => {
        const stage = lead.stage?.toLowerCase().trim();
        if (organized[stage]) organized[stage].push(lead);
      });
      setLeads(organized);
    } catch (err) {
      console.error("❌ Failed to fetch leads:", err);
    }
  };

  useEffect(() => {
    loadLeads();

    // WebSocket مفتوح طوال المدة
    socket.current = new WebSocket("ws://localhost:8000/ws/leads/");
    socket.current.onopen = () => console.log("✅ WebSocket Connected");
    socket.current.onclose = () => console.warn("❌ WebSocket Disconnected");
    socket.current.onmessage = (event) => {
      const { message } = JSON.parse(event.data);
      console.log("📩 WebSocket message:", message);
      loadLeads();
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    if (!leads[sourceStage] || !leads[destStage]) return;
    if (sourceStage === destStage && source.index === destination.index) return;

    const sourceItems = Array.from(leads[sourceStage]);
    const destItems = Array.from(leads[destStage]);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceStage === destStage) {
      sourceItems.splice(destination.index, 0, movedItem);
      setLeads((prev) => ({ ...prev, [sourceStage]: sourceItems }));
    } else {
      const updatedItem = { ...movedItem, stage: destStage };
      destItems.splice(destination.index, 0, updatedItem);
      setLeads((prev) => ({
        ...prev,
        [sourceStage]: sourceItems,
        [destStage]: destItems,
      }));
      try {
        await updateLeadStage(movedItem.id, destStage);

        // ✅ إرسال تحديث عبر WebSocket المفتوح
        socket.current.send(JSON.stringify({
          action: "drag",
          id: movedItem.id,
          stage: destStage,
        }));
      } catch (err) {
        console.error("❌ Failed to update lead stage:", err);
      }
    }
  };

  return (
    <div style={{ padding: 20, background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h2 style={{ margin: 0 }}>🧠 CRM Kanban Board</h2>
        <button
          onClick={() => navigate("/lead/new")}
          style={{
            padding: "8px 16px", background: "#198754", border: "none",
            borderRadius: "6px", color: "white", fontWeight: "bold", cursor: "pointer",
          }}
        >
          ➕ Add Lead
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {stages.map((stage) => (
            <Droppable key={stage} droppableId={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: "#e9ecef", padding: 10, borderRadius: 10,
                    minHeight: 400, width: 250, transition: "all 0.3s ease-in-out",
                  }}
                >
                  <h5 style={{ textAlign: "center", color: getColor(stage) }}>
                    {stageLabels[stage]}
                  </h5>
                  {leads[stage].map((lead, index) => (
                    <Draggable key={lead.id} draggableId={String(lead.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: 16,
                            marginBottom: 8,
                            borderRadius: "10px",
                            background: getColor(stage),
                            color: "white",
                            boxShadow: snapshot.isDragging ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                            transform: snapshot.isDragging ? "scale(1.03)" : "scale(1)",
                            transition: "all 0.2s",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{lead.name}</strong>
                          <div>{lead.email}</div>
                          <button
                            onClick={() => navigate(`/lead/${lead.id}`)}
                            style={{
                              marginTop: 8,
                              background: "white",
                              color: getColor(stage),
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "0.9em",
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanPage;
