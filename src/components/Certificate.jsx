import React, { useState } from "react"
import { Modal, IconButton, Box, Backdrop, Typography, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import VisibilityIcon from "@mui/icons-material/Visibility"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"

const Certificate = ({ ImgSertif, Link }) => {
	const [open, setOpen] = useState(false)

	// Deteksi apakah file berupa PDF
	const isPdf = ImgSertif?.toLowerCase().includes('.pdf')

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Thumbnail Container */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 2,
					boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
						"& .overlay": { opacity: 1 },
						"& .hover-content": { transform: "translate(-50%, -50%)", opacity: 1 },
						"& .certificate-media": { filter: "contrast(1.05) brightness(1) saturate(1.1)" },
					},
				}}>
				
				<Box
					sx={{
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0, left: 0, right: 0, bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							zIndex: 1,
						},
					}}>
					
					{/* Render Iframe untuk PDF, Img untuk Gambar */}
					{isPdf ? (
						<iframe
							src={`${ImgSertif}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
							title="PDF Preview"
							className="certificate-media"
							style={{
								width: "100%",
								height: "100%",
								border: "none",
								aspectRatio: "16/11.5",
								pointerEvents: "none", // Memastikan interaksi mouse tembus ke overlay
								objectFit: "cover",
								overflow: "hidden"
							}}
						/>
					) : (
						<img
							className="certificate-media"
							src={ImgSertif}
							alt="Certificate"
							style={{
								width: "100%",
								height: "auto",
								display: "block",
								objectFit: "cover",
								filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
								transition: "filter 0.3s ease",
								aspectRatio: "16/11.5",
							}}
						/>
					)}
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
						opacity: 0, transition: "all 0.3s ease", zIndex: 2,
						backgroundColor: "rgba(0, 0, 0, 0.5)", // Sedikit digelapkan agar tombol lebih jelas
					}}>
					
					{/* Hover Content (DUA TOMBOL) */}
					<Box
						className="hover-content"
						sx={{
							position: "absolute", top: "50%", left: "50%",
							transform: "translate(-50%, -40%)", opacity: 0,
							transition: "all 0.4s ease", 
							display: "flex", flexDirection: "column", gap: 1.5,
							width: "80%", alignItems: "center"
						}}>
						
						{/* Tombol 1: Lihat Sertifikat (Pop-up Modal) */}
						<Button
							variant="contained"
							startIcon={<VisibilityIcon />}
							onClick={(e) => { e.stopPropagation(); setOpen(true); }}
							fullWidth
							sx={{
								bgcolor: "rgba(255, 255, 255, 0.2)",
								backdropFilter: "blur(5px)",
								color: "white",
								textTransform: "none",
								fontWeight: 600,
								"&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" }
							}}
						>
							Lihat Sertifikat
						</Button>

						{/* Tombol 2: Buka Dokumen (Tab Baru) */}
						<Button
							variant="contained"
							startIcon={<OpenInNewIcon />}
							onClick={(e) => { 
								e.stopPropagation(); 
								window.open(Link || ImgSertif, "_blank", "noopener,noreferrer"); 
							}}
							fullWidth
							sx={{
								bgcolor: "#6366f1", // Warna tombol (Indigo)
								color: "white",
								textTransform: "none",
								fontWeight: 600,
								"&:hover": { bgcolor: "#4f46e5" }
							}}
						>
							Buka Dokumen
						</Button>
					</Box>
				</Box>
			</Box>

			{/* Modal Pop-up */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						backdropFilter: "blur(5px)",
					},
				}}
				sx={{
					display: "flex", alignItems: "center", justifyContent: "center",
					margin: 0, padding: 0,
					"& .MuiBackdrop-root": { backgroundColor: "rgba(0, 0, 0, 0.9)" },
				}}>
				<Box
					sx={{
						position: "relative", width: "auto",
						maxWidth: "90vw", maxHeight: "90vh",
						m: 0, p: 0, outline: "none",
					}}>
					
					{/* Close Button */}
					<IconButton
						onClick={handleClose}
						sx={{
							position: "absolute", right: 16, top: 16, color: "white",
							bgcolor: "rgba(0,0,0,0.6)", zIndex: 10, padding: 1,
							"&:hover": { bgcolor: "rgba(0,0,0,0.8)", transform: "scale(1.1)" },
						}}
						size="large">
						<CloseIcon sx={{ fontSize: 24 }} />
					</IconButton>

					{/* Modal Content: iframe untuk PDF, img untuk Gambar */}
					{isPdf ? (
						<iframe
							src={ImgSertif}
							title="PDF Full View"
							style={{
								display: "block",
								width: "80vw", // Lebar iframe untuk PDF
								height: "85vh", // Tinggi iframe untuk PDF
								margin: "0 auto",
								border: "none",
								borderRadius: "8px",
								backgroundColor: "white" // Background putih jika PDF transparan
							}}
						/>
					) : (
						<img
							src={ImgSertif}
							alt="Certificate Full View"
							style={{
								display: "block",
								maxWidth: "100%",
								maxHeight: "90vh",
								margin: "0 auto",
								objectFit: "contain",
							}}
						/>
					)}
				</Box>
			</Modal>
		</Box>
	)
}

export default Certificate
