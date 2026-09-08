import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Enquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/enquiries");

      setEnquiries(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to load enquiries:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load enquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const searchText = `
      ${enquiry.enquiryNumber || ""}
      ${enquiry.name || ""}
      ${enquiry.phone || ""}
      ${enquiry.email || ""}
      ${enquiry.courseId?.name || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "ALL" ||
      enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    return `enquiry-status status-${status
      ?.toLowerCase()
      .replace("_", "-")}`;
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Enquiry Management</h1>
          <p>Manage student enquiries and follow-ups</p>
        </div>
      </div>


      {/* FILTERS */}
      <div className="enquiry-filters">

        <input
          type="text"
          placeholder="Search by name, phone, email or enquiry number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">All Status</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="CONVERTED">Converted</option>
          <option value="NOT_INTERESTED">
            Not Interested
          </option>
          <option value="CLOSED">Closed</option>
        </select>

      </div>


      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* LOADING */}
      {loading ? (
        <div className="loading">
          Loading enquiries...
        </div>
      ) : (

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Enquiry No.</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredEnquiries.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="empty"
                  >
                    No enquiries found
                  </td>
                </tr>

              ) : (

                filteredEnquiries.map((enquiry) => (

                  <tr key={enquiry._id}>

                    <td>
                      <strong>
                        {enquiry.enquiryNumber}
                      </strong>
                    </td>

                    <td>
                      {enquiry.name}
                    </td>

                    <td>
                      {enquiry.phone}
                    </td>

                    <td>
                      {enquiry.email || "-"}
                    </td>

                    <td>
                      {enquiry.courseId?.name || "-"}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          enquiry.status
                        )}
                      >
                        {enquiry.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        enquiry.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() =>
                          navigate(
                            `/admin/enquiries/${enquiry._id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}