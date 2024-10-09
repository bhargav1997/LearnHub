export const fetchUserConnections = async () => {
   const token = localStorage.getItem("token");
   if (!token) {
      throw new Error("No token found");
   }

   const response = await fetch("http://localhost:5073/api/users/connections", {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch connections: ${response.status} ${response.statusText}`);
   }

   return await response.json();
};
