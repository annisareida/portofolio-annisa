import React, { useState } from "react"
import { Modal, IconButton, Box, Backdrop, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf" // Tambahan Ikon PDF

const Certificate = ({ ImgSertif, Link }) => {
	const [open, setOpen] = useState(false)

	// Cek apakah file adalah PDF berdasarkan URL-nya
	const isPdf = ImgSertif?.toLowerCase().includes('.pdf')

	const handleOpen = () => {
		if (Link || isPdf) {
			// Jika PDF atau punya link eksternal, buka di tab baru
			window.open(Link || ImgSertif, "_blank", "noopener,noreferrer")
		} else {
			setOpen(true)
		}
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Box component="div" sx={{ width: "100%" }}>
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
						"& .certificate-image": { filter: "contrast(1.05) brightness(1) saturate(1.1)" },
					},
				}}>
				
				<Box
					sx={{
						position: "relative",
						bgcolor: isPdf ? "rgba(255,255,255,0.05)" : "transparent",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0, left: 0, right: 0, bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							zIndex: 1,
						},
					}}>
					
					{/* LOGIKA PENAMPILAN: Jika PDF tampilkan Ikon, jika Gambar tampilkan tag img */}
					{isPdf ? (
						<Box 
							sx={{ 
								width: "100%", 
								aspectRatio: "16/11.5", 
								display: "flex", 
								flexDirection: "column",
								alignItems: "center", 
								justifyContent: "center",
								cursor: "pointer",
								border: "1px solid rgba(255,255,255,0.1)"
							}}
							onClick={handleOpen}
						>
							<PictureAsPdfIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 1 }} />
							<Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>Dokumen PDF</Typography>
						</Box>
					) : (
						<img
							className="certificate-image"
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
							onClick={handleOpen}
						/>
					)}
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
						opacity: 0, transition: "all 0.3s ease", cursor: "pointer", zIndex: 2,
					}}
					onClick={handleOpen}>
					<Box
						className="hover-content"
						sx={{
							position: "absolute", top: "50%", left: "50%",
							transform: "translate(-50%, -60%)", opacity: 0,
							transition: "all 0.4s ease", textAlign: "center", width: "100%", color: "white",
						}}>
						<FullscreenIcon sx={{ fontSize: 40, mb: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
						<Typography variant="h6" sx={{ fontWeight: 600, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
							{Link || isPdf ? "Buka Dokumen" : "Lihat Sertifikat"}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Modal hanya dirender jika BUKAN PDF */}
			{!isPdf && (
				<Modal
					open={open}
					onClose={handleClose}
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 300,
						sx: { backgroundColor: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(5px)" },
					}}
					sx={{ display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
					<Box sx={{ position: "relative", width: "auto", maxWidth: "90vw", maxHeight: "90vh", outline: "none" }}>
						<IconButton
							onClick={handleClose}
							sx={{
								position: "absolute", right: 16, top: 16, color: "white",
								bgcolor: "rgba(0,0,0,0.6)", zIndex: 1, padding: 1,
								"&:hover": { bgcolor: "rgba(0,0,0,0.8)", transform: "scale(1.1)" },
							}}
							size="large">
							<CloseIcon sx={{ fontSize: 24 }} />
						</IconButton>
						<img src={ImgSertif} alt="Certificate Full View" style={{ display: "block", maxWidth: "100%", maxHeight: "90vh", margin: "0 auto", objectFit: "contain" }} />
					</Box>
				</Modal>
			)}
		</Box>
	)
}

export default Certificate
