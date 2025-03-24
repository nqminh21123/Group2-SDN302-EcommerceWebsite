import { useState } from "react"
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap"
import { FaCloudUploadAlt, FaImage, FaLink } from "react-icons/fa"

const Cloudinary = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedImages, setUploadedImages] = useState([])
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("") // "success" hoặc "danger"

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)

            // Create preview URL
            const fileReader = new FileReader()
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result)
            }
            fileReader.readAsDataURL(file)
        }
    }

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Vui lòng chọn một tệp ảnh")
            setMessageType("danger")
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append("image", selectedFile)

            const response = await fetch("http://localhost:9999/api/cloudinary/add-img", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                setMessage("Tải ảnh lên thành công")
                setMessageType("success")

                // Add new image to the list
                setUploadedImages((prev) => [
                    {
                        id: result.data.id,
                        url: result.data.url,
                        uploadedAt: new Date().toLocaleString("vi-VN"),
                    },
                    ...prev,
                ])

                // Reset form
                setSelectedFile(null)
                setPreviewUrl("")
            } else {
                setMessage(result.message || "Tải ảnh lên thất bại")
                setMessageType("danger")
            }
        } catch (error) {
            console.error("Upload error:", error)
            setMessage("Đã xảy ra lỗi khi tải ảnh lên")
            setMessageType("danger")
        } finally {
            setIsUploading(false)
        }
    }

    // Copy URL to clipboard
    const copyToClipboard = (url) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setMessage("Đã sao chép URL vào clipboard")
                setMessageType("success")
            })
            .catch(() => {
                setMessage("Không thể sao chép URL")
                setMessageType("danger")
            })
    }

    return (
        <Container fluid className="py-4">
            <Card className="mb-4 shadow-sm">
                <Card.Header as="h5" className="bg-primary text-white">
                    <FaCloudUploadAlt className="me-2" /> Tải ảnh lên Cloudinary
                </Card.Header>
                <Card.Body>
                    {message && <Alert variant={messageType} className="mb-3">{message}</Alert>}

                    <Row>
                        <Col md={6}>
                            <div className="border border-2 border-dashed rounded p-3 text-center mb-3">
                                <Form.Group controlId="formFile" className="mb-0">
                                    <Form.Label className="d-block cursor-pointer py-4">
                                        <FaImage className="fs-1 text-secondary mb-2" />
                                        <p className="text-muted">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                                        <p className="text-muted small">PNG, JPG, WEBP (Tối đa 5MB)</p>
                                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} className="d-none" />
                                    </Form.Label>
                                </Form.Group>
                            </div>

                            <Button
                                variant="primary"
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="w-100"
                            >
                                {isUploading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Đang tải lên...
                                    </>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt className="me-2" />
                                        Tải lên Cloudinary
                                    </>
                                )}
                            </Button>
                        </Col>

                        <Col md={6} className="d-flex align-items-center justify-content-center">
                            <div className="border rounded bg-light p-3 text-center w-100 h-100 d-flex align-items-center justify-content-center">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        className="img-fluid"
                                        style={{ maxHeight: "200px" }}
                                    />
                                ) : (
                                    <div className="text-center text-secondary">
                                        <FaImage className="fs-1 mb-2" />
                                        <p>Xem trước ảnh</p>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-primary text-white">
                    <FaImage className="me-2" /> Ảnh đã tải lên
                </Card.Header>
                <Card.Body>
                    {uploadedImages.length > 0 ? (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Ảnh</th>
                                        <th>ID</th>
                                        <th>URL</th>
                                        <th>Thời gian</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedImages.map((image, index) => (
                                        <tr key={image.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={image.url || "/placeholder.svg"}
                                                    alt={image.id}
                                                    className="img-thumbnail"
                                                    style={{ width: "64px", height: "64px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>{image.id}</td>
                                            <td className="text-truncate" style={{ maxWidth: "200px" }}>
                                                {image.url}
                                            </td>
                                            <td>{image.uploadedAt}</td>
                                            <td>
                                                <Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(image.url)}>
                                                    <FaLink className="me-1" /> Sao chép URL
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-secondary">
                            <FaImage className="fs-1 mb-2 opacity-50" />
                            <p>Chưa có ảnh nào được tải lên</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Cloudinary
