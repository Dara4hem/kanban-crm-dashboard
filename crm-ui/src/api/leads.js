const BASE_URL = "http://localhost:8000/api/leads/";

export const fetchLeads = async () => {
  const response = await fetch(BASE_URL);
  return await response.json();
};

export const updateLeadStage = async (id, newStage) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stage: newStage }),
  });
  return await response.json();
};
