import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card,
  Table,
  ProgressBar,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/order/orders");
        const data = res.data?.data;
        setOrders(data);
        calculateStats(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const calculateStats = (orderData) => {
    const totalOrders = orderData.length;
    const totalRevenue = orderData.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const pendingOrders = orderData.filter(
      (order) => order.status.toLowerCase() === "pending"
    ).length;
    const deliveredOrders = orderData.filter(
      (order) => order.status.toLowerCase() === "delivered"
    ).length;

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    });
  };

  const getRecentOrders = () => {
    return orders.slice(0, 5).map((order) => ({
      id: `#${order.invoice}`,
      customer: order.name,
      status: order.status,
      date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
      amount: `$${order.totalAmount.toFixed(2)}`,
    }));
  };

  const salesData = [
    { name: "Jan", sales: 4000, profit: 2400 },
    { name: "Feb", sales: 3000, profit: 1398 },
    { name: "Mar", sales: 2000, profit: 9800 },
    { name: "Apr", sales: 2780, profit: 3908 },
    { name: "May", sales: 1890, profit: 4800 },
    { name: "Jun", sales: 2390, profit: 3800 },
  ];

  const processOrdersForPieChart = (orders) => {
    const productCounts = {};

    orders.forEach((order) => {
      if (order.cart && Array.isArray(order.cart)) {
        order.cart.forEach((item) => {
          const productName = item.title || "Unknown Product";
          const quantity = item.orderQuantity || 1;

          if (productCounts[productName]) {
            productCounts[productName] += quantity;
          } else {
            productCounts[productName] = quantity;
          }
        });
      }
    });

    const pieData = Object.keys(productCounts).map((productName) => ({
      name: productName,
      value: productCounts[productName],
    }));

    pieData.sort((a, b) => b.value - a.value);

    if (pieData.length > 5) {
      const topProducts = pieData.slice(0, 4);
      const otherProducts = pieData.slice(4);

      const otherProductsValue = otherProducts.reduce(
        (total, product) => total + product.value,
        0
      );

      topProducts.push({
        name: "Các sản phẩm khác",
        value: otherProductsValue,
      });

      return topProducts;
    }

    return pieData;
  };

  const pieData = processOrdersForPieChart(orders);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const recentOrders = getRecentOrders();
  console.log(recentOrders);

  return (
    <div className="dashboard">
      {/* Navbar */}

      {/* Main Content */}
      <Container fluid className="mt-4">
        {/* Statistics Cards */}
        <Row>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Total Revenue</Card.Title>
                <h2>${stats.totalRevenue.toFixed(2)}</h2>
                <div className="text-success">+12.5% from last month</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Total Orders</Card.Title>
                <h2>{stats.totalOrders}</h2>
                <div className="text-success">+5.3% from last month</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Order Pending</Card.Title>
                <h2>{stats.pendingOrders}</h2>
                <div className="text-danger">-2.7% from last month</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Order completed</Card.Title>
                <h2>{stats.deliveredOrders}</h2>
                <div className="text-success">+1.2% from last month</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>Sales Overview</Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header>Sales Distribution</Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders */}
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>Recent Orders</Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Processing"
                                ? "primary"
                                : "warning"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header>Tasks Progress</Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Website Redesign</span>
                    <span>65%</span>
                  </div>
                  <ProgressBar now={65} variant="primary" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Mobile App Development</span>
                    <span>85%</span>
                  </div>
                  <ProgressBar now={85} variant="success" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Marketing Campaign</span>
                    <span>35%</span>
                  </div>
                  <ProgressBar now={35} variant="warning" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Database Migration</span>
                    <span>50%</span>
                  </div>
                  <ProgressBar now={50} variant="info" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
