// Modify the Employee Search Handler
// Update the handleEmployeeSearch function to fetch learning data for each employee:

const handleEmployeeSearch = (event, value) => {
  if (value.length > 0) {
    let apiUrl;
    if (formData.employeeDetails === "add" && formData.requestonbehalfRole !== 4) {
      apiUrl = `http://localhost:8000/api/employeeSearchByName/searchEmployeesByName?managerId=${formData.requestonbehalf}&name=${value}`;
    } else {
      apiUrl = `http://localhost:8000/api/employees/searchWithoutManager?name=${value}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then(async (data) => {
        if (Array.isArray(data)) {
          const employeesWithSkills = await Promise.all(
            data.map(async (emp) => {
              try {
                const learnerResponse = await fetch(
                  `http://localhost:8000/api/learners/getLearners/${emp.emp_id}`
                );
                const learnerData = await learnerResponse.json();
                return {
                  ...emp,
                  totalPrimarySkills: learnerData.total_primary_skills || 0,
                };
              } catch (error) {
                console.error("Error fetching learner data:", error);
                return { ...emp, totalPrimarySkills: 0 };
              }
            })
          );
          setSearchResults(
            employeesWithSkills.map((emp) => ({
              id: emp.emp_id,
              name: emp.emp_name,
              email: emp.emp_email,
              profileImage: `data:image/jpeg;base64,${arrayBufferToBase64(emp.profile_image.data)}`,
              uniqueKey: `${emp.emp_id}-${Date.now()}`,
              totalPrimarySkills: emp.totalPrimarySkills,
            }))
          );
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }
};




// Update Autocomplete Rendering
// Modify the renderOption prop in the Autocomplete component to display the learning count:

<Autocomplete
  options={searchResults}
  getOptionLabel={(option) => option.name || ""}
  onInputChange={handleEmployeeSearch}
  onChange={(event, value) => setSelectedEmployee(value)}
  renderInput={(params) => (
    // ... existing TextField code
  )}
  renderOption={(props, option) => (
    <li
      {...props}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        fontSize: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Avatar src={option.profileImage} style={{ width: 24, height: 24 }} />
        <div>
          <div>{option.name}</div>
          <div style={{ fontSize: "10px", color: "#666" }}>
            {option.email}
          </div>
        </div>
      </div>
      {option.totalPrimarySkills > 0 && (
        <span
          style={{
            backgroundColor: "#e0e0e0",
            borderRadius: "12px",
            padding: "4px 8px",
            fontSize: "10px",
          }}
        >
          {option.totalPrimarySkills} learning in progress
        </span>
      )}
    </li>
  )}
/>
