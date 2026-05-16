import { useEffect, useState } from 'react'
import { supabase } from "../../supabase";
import { Award, Upload, Trash2, ImageIcon, Plus, FileText } from 'lucide-react' // Tambahkan FileText untuk ikon PDF

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10" />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl overflow-hidden">
      <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
    </div>
  </div>
)

const CertCard = ({ cert, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  
  // Deteksi apakah URL ini adalah PDF
  const certUrl = cert.Img || cert.img; // Menangani perbedaan huruf besar/kecil dari database
  const isPdf = certUrl?.toLowerCase().includes('.pdf');

  return (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-white/5 border border-white/12 rounded-2xl overflow-hidden h-full flex flex-col">
        
        {/* Tampilan berdasarkan tipe file */}
        {isPdf ? (
          <div className="w-full aspect-[16/11.5] flex flex-col items-center justify-center bg-white/5 group-hover:scale-105 transition-transform duration-500">
            <FileText className="w-12 h-12 text-indigo-400 mb-2" />
            <span className="text-sm font-medium text-gray-300">PDF Document</span>
          </div>
        ) : (
          <>
            {!imgLoaded && (
              <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
            )}
            <img
              src={certUrl}
              alt="Certificate"
              onLoad={() => setImgLoaded(true)}
              className={`w-full aspect-[16/11.5] object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
            />
          </>
        )}

        {/* Overlay Tombol Aksi */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
          {isPdf && (
            <a
              href={certUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs w-full hover:bg-indigo-500/30 transition-colors"
            >
              Lihat PDF
            </a>
          )}
          <button
            onClick={() => onDelete(cert.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs w-full justify-center hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [link, setLink] = useState('')

  const fetchCerts = async () => {
    setLoading(true)
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCerts() }, [])

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const uploadImage = async () => {
    if (!file) return
    setUploading(true)
    
    try {
      const fileName = `cert-${Date.now()}-${file.name}`
      const { error: storageError } = await supabase.storage.from('certificate-images').upload(fileName, file)
      
      if (storageError) throw storageError;

      const { data } = supabase.storage.from('certificate-images').getPublicUrl(fileName)
      
      const { error: dbError } = await supabase.from('certificates').insert({ 
        Img: data.publicUrl, 
        Link: link || null 
      })

      if (dbError) throw dbError;

      setFile(null); 
      setPreview(null); 
      setLink(''); 
      fetchCerts();
      alert("Upload Berhasil!");

    } catch (error) {
      console.error("Error upload:", error);
      alert("Gagal Upload: " + error.message);
    } finally {
      setUploading(false)
    }
  }

  const deleteCert = async (id) => {
    if (!confirm('Delete this certificate?')) return
    await supabase.from('certificates').delete().eq('id', id)
    fetchCerts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Certificates</h1>
          <p className="text-gray-500 text-xs">
            {loading ? 'Loading...' : `${certs.length} certificates total`}
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" /> Upload Certificate
          </h2>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-indigo-400/60 bg-indigo-500/10' : 'border-white/12 bg-white/4 hover:border-indigo-500/35 hover:bg-white/7'
            }`}
          >
            {preview ? (
              // Jika PDF, tampilkan icon dokumen. Jika gambar, tampilkan gambar.
              (file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf')) ? (
                <div className="text-center space-y-2 p-6">
                  <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                  <p className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</p>
                </div>
              ) : (
                <img src={preview} alt="preview" className="max-h-40 object-contain rounded-lg p-2" />
              )
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-11 h-11 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-sm text-gray-300">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-600">PNG, JPG, WEBP, PDF supported</p>
              </div>
            )}
            
            {/* Tambahkan application/pdf agar user bisa memilih file PDF di file explorer */}
            <input type="file" accept="image/*,application/pdf" onChange={e => handleFile(e.target.files[0])} className="hidden" />
          </label>

          {/* PERBAIKAN: Pindahkan input ini ke LUAR <label> drag & drop */}
          <input 
            type="text" 
            placeholder="Credential Link (Optional)" 
            value={link} 
            onChange={(e) => setLink(e.target.value)} 
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" 
          />

          {file && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-400 truncate flex-1">{file.name}</p>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setFile(null); setPreview(null); setLink('') }}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-500 hover:text-white text-xs transition-colors">
                  Clear
                </button>
                <button onClick={uploadImage} disabled={uploading} className="relative group/u">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/u:opacity-100 transition duration-300" />
                  <div className="relative flex items-center gap-2 px-4 py-1.5 bg-[#030014] rounded-xl border border-white/10">
                    {uploading ? <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5 text-indigo-400" />}
                    <span className="text-xs text-gray-200">{uploading ? 'Uploading...' : 'Upload'}</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No certificates yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {certs.map(cert => (
            <CertCard key={cert.id} cert={cert} onDelete={deleteCert} />
          ))}
        </div>
      )}
    </div>
  )
}
