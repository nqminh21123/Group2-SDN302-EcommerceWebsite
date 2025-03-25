import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Lọc chi tiết
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    country: "",
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Thay thế bằng API thực tế của bạn
        const response = await axios.get("http://localhost:9999/api/admin/all");
        setUsers(response.data?.data);
        setLoading(false);
        return;
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Tính tổng số trang khi users hoặc usersPerPage thay đổi
  useEffect(() => {
    setTotalPages(Math.ceil(users.length / usersPerPage));
  }, [users, usersPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      role: "",
      status: "",
      country: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  };

  const getFilteredUsers = () => {
    return getSortedUsers().filter((user) => {
      // Tìm kiếm đơn giản
      if (
        searchTerm &&
        !Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      // Tìm kiếm nâng cao
      if (
        filters.name &&
        !user.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.email &&
        !user.email.toLowerCase().includes(filters.email.toLowerCase())
      ) {
        return false;
      }
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      if (filters.status && user.status !== filters.status) {
        return false;
      }
      if (
        filters.country &&
        !user.country.toLowerCase().includes(filters.country.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  // Lấy users cho trang hiện tại
  const getCurrentUsers = () => {
    const filteredUsers = getFilteredUsers();
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  };

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tạo phân trang
  const renderPagination = () => {
    const pageNumbers = [];

    // Hiển thị tối đa 5 nút trang
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(1)}>
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(number)}>
                {number}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Danh sách người dùng</h2>

      {/* Tìm kiếm cơ bản */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              <i className="bi bi-funnel"></i>{" "}
              {showAdvancedSearch ? "Ẩn bộ lọc" : "Bộ lọc"}
            </button>
          </div>
        </div>
        <div className="col-md-6 text-md-end">
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-1"></i> Thêm người dùng mới
          </button>
        </div>
      </div>

      {/* Tìm kiếm nâng cao */}
      {showAdvancedSearch && (
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 mb-2">
                <label className="form-label">Tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên"
                />
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo email"
                />
              </div>
              <div className="col-md-2 mb-2">
                <label className="form-label">Vai trò</label>
                <select
                  className="form-select"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <label className="form-label">Quốc gia</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo quốc gia"
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-1"></i> Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị số bản ghi mỗi trang */}
      <div className="row mb-3 align-items-center">
        <div className="col-6">
          <span>
            Hiển thị {getCurrentUsers().length} trong số{" "}
            {getFilteredUsers().length} người dùng
          </span>
        </div>
        <div className="col-6 text-end">
          <label className="me-2">Hiển thị:</label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset về trang đầu khi thay đổi số lượng hiển thị
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Bảng hiển thị dữ liệu */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th
                onClick={() => requestSort("name")}
                style={{ cursor: "pointer" }}
              >
                Tên{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th>Hình ảnh</th>
              <th
                onClick={() => requestSort("role")}
                style={{ cursor: "pointer" }}
              >
                Vai trò{" "}
                {sortConfig.key === "role" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th>Địa chỉ</th>
              <th
                onClick={() => requestSort("email")}
                style={{ cursor: "pointer" }}
              >
                Email{" "}
                {sortConfig.key === "email" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th>Số điện thoại</th>
              <th
                onClick={() => requestSort("status")}
                style={{ cursor: "pointer" }}
              >
                Trạng thái{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => requestSort("joiningDate")}
                style={{ cursor: "pointer" }}
              >
                Ngày tham gia{" "}
                {sortConfig.key === "joiningDate" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentUsers().map((user, index) => (
              <tr key={user.id || index}>
                <td>{user.name}</td>
                <td>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="rounded-circle"
                    width="40"
                    height="40"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.ibb.co/Ydf3C1H/brand-1.png";
                    }}
                  />
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.role === "Admin"
                        ? "bg-danger"
                        : user.role === "Manager"
                        ? "bg-success"
                        : "bg-info"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{`${user.address}, ${user.city}, ${user.country}`}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "Active" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{formatDate(user.joiningDate)}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-sm btn-info me-1">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-warning me-1"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Thông báo khi không có kết quả */}
      {getFilteredUsers().length === 0 && (
        <div className="alert alert-info mt-3">
          Không tìm thấy người dùng phù hợp với từ khóa tìm kiếm.
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 0 && renderPagination()}
    </div>
  );
};

export default UserList;
