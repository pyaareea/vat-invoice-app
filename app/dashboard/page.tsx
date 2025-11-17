'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

type Entry = {
  id: number
  description: string
  amount: number
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [vatRate, setVatRate] = useState(15)
  const [entries, setEntries] = useState<Entry[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      description: '',
      amount: 0
    }))
  )
  const [sheetName, setSheetName] = useState('Invoice Sheet')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
    } else {
      setUser(session.user)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const updateEntry = (id: number, field: 'description' | 'amount', value: string | number) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const calculateVAT = (amount: number) => (amount * vatRate) / 100
  const calculateTotal = (amount: number) => amount + calculateVAT(amount)

  const getTotals = () => {
    const totalAmount = entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0)
    const totalVAT = (totalAmount * vatRate) / 100
    const grandTotal = totalAmount + totalVAT
    return { totalAmount, totalVAT, grandTotal }
  }

  const saveToCloud = async () => {
    if (!user) return

    const { totalAmount, totalVAT, grandTotal } = getTotals()

    try {
      const { error } = await supabase
        .from('invoice_sheets')
        .insert({
          user_id: user.id,
          sheet_name: sheetName,
          vat_rate: vatRate,
          entries: entries.filter(e => e.description || e.amount),
          total_amount: totalAmount,
          total_vat: totalVAT,
          grand_total: grandTotal
        })

      if (error) throw error
      toast.success('Sheet saved to cloud successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Error saving to cloud')
    }
  }

  const exportToExcel = () => {
    const { totalAmount, totalVAT, grandTotal } = getTotals()
    
    const data = entries.map(entry => ({
      'S.No': entry.id,
      'Description': entry.description,
      'Amount': entry.amount,
      'VAT (%)': vatRate,
      'VAT Amount': calculateVAT(entry.amount).toFixed(2),
      'Total': calculateTotal(entry.amount).toFixed(2)
    }))

    data.push({
  'S.No': null,
  'Description': 'TOTALS',
  'Amount': totalAmount.toFixed(2),
  'VAT (%)': '',
  'VAT Amount': totalVAT.toFixed(2),
  'Total': grandTotal.toFixed(2)
})

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice')
    XLSX.writeFile(wb, `${sheetName}.xlsx`)
    toast.success('Excel file downloaded!')
  }

  const exportToPDF = () => {
    const { totalAmount, totalVAT, grandTotal } = getTotals()
    const doc = new jsPDF({ orientation: 'landscape' })

    doc.setFontSize(18)
    doc.text('PAKISTAN INTERNATIONAL SCHOOL', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' })
    doc.setFontSize(14)
    doc.text('ENGLISH SECTION RIYADH', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' })

    const tableData = entries.map(entry => [
      entry.id,
      entry.description,
      entry.amount.toFixed(2),
      `${vatRate}%`,
      calculateVAT(entry.amount).toFixed(2),
      calculateTotal(entry.amount).toFixed(2)
    ])

    tableData.push([
      '',
      'TOTALS',
      totalAmount.toFixed(2),
      '',
      totalVAT.toFixed(2),
      grandTotal.toFixed(2)
    ])

    ;(doc as any).autoTable({
      startY: 30,
      head: [['S.No', 'Description', 'Amount', 'VAT %', 'VAT Amount', 'Total']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 }
    })

    doc.save(`${sheetName}.pdf`)
    toast.success('PDF file downloaded!')
  }

  const handlePrint = () => {
    window.print()
  }

  const { totalAmount, totalVAT, grandTotal } = getTotals()

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 no-print">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VAT Invoice System</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="print-header text-center mb-6">
            <h1 className="text-3xl font-bold">PAKISTAN INTERNATIONAL SCHOOL</h1>
            <h2 className="text-xl font-semibold">ENGLISH SECTION RIYADH</h2>
          </div>

          <div className="flex gap-4 mb-6 no-print">
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="Sheet Name"
            />
            <div className="flex items-center gap-2">
              <label className="font-medium">VAT Rate:</label>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 w-16">S.No</th>
                  <th className="border border-gray-300 px-4 py-2">Description</th>
                  <th className="border border-gray-300 px-4 py-2 w-32">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 w-24">VAT %</th>
                  <th className="border border-gray-300 px-4 py-2 w-32">VAT Amount</th>
                  <th className="border border-gray-300 px-4 py-2 w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border border-gray-300 px-4 py-2 text-center">{entry.id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 border-0 focus:ring-0"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={entry.amount || ''}
                        onChange={(e) => updateEntry(entry.id, 'amount', Number(e.target.value))}
                        className="w-full px-2 py-1 border-0 focus:ring-0 text-right"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{vatRate}%</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {calculateVAT(entry.amount).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                      {calculateTotal(entry.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-yellow-50 font-bold">
                  <td colSpan={2} className="border border-gray-300 px-4 py-3 text-right">TOTALS:</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{totalAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-3"></td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{totalVAT.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-lg">{grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 mt-6 no-print">
            <button
              onClick={saveToCloud}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save to Cloud
            </button>
            <button
              onClick={exportToExcel}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Print (Landscape)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
