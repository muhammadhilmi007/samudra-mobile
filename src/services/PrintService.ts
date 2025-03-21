// src/services/PrintService.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { formatDate } from '../utils/formatters/dateFormatter';
import { formatCurrency } from '../utils/formatters/currencyFormatter';
import { STT } from '../types/models/stt';
import { Pickup } from '../types/models/pickup';
import { Delivery } from '../types/models/delivery';
import { Loading } from '../types/models/warehouse';

class PrintService {
  /**
   * Generate PDF from HTML content
   * @param html HTML content to convert to PDF
   * @param filename Optional filename (without extension)
   * @returns URI to the generated PDF
   */
  private async generatePDF(html: string, filename?: string): Promise<string> {
    try {
      // Generate the PDF
      const { uri } = await Print.printToFileAsync({ html });
      
      // If filename provided, rename the file
      if (filename) {
        const destination = `${FileSystem.documentDirectory}${filename}.pdf`;
        await FileSystem.moveAsync({
          from: uri,
          to: destination,
        });
        return destination;
      }
      
      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Share a PDF file
   * @param uri URI to the PDF file
   * @param title Optional title for the share dialog
   */
  public async sharePDF(uri: string, title?: string): Promise<void> {
    try {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        // Check if sharing is available
        if (!(await Sharing.isAvailableAsync())) {
          throw new Error('Sharing is not available on this device');
        }
        
        // Share the PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf',
          dialogTitle: title || 'Share PDF',
        });
      } else {
        throw new Error('Sharing is only available on Android and iOS');
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw error;
    }
  }

  /**
   * Generate and share a PDF file
   * @param html HTML content to convert to PDF
   * @param options Options for file generation
   */
  public async generateAndSharePDF(
    html: string,
    options: { filename?: string; title?: string } = {}
  ): Promise<void> {
    try {
      const uri = await this.generatePDF(html, options.filename);
      await this.sharePDF(uri, options.title);
    } catch (error) {
      console.error('Error generating and sharing PDF:', error);
      throw error;
    }
  }

  /**
   * Print directly to a printer
   * @param html HTML content to print
   */
  public async printHTML(html: string): Promise<void> {
    try {
      await Print.printAsync({ html });
    } catch (error) {
      console.error('Error printing HTML:', error);
      throw error;
    }
  }

  /**
   * Generate HTML for STT
   * @param stt STT data
   * @returns HTML string
   */
  public generateSTTHTML(stt: STT): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #1565C0;
              padding-bottom: 20px;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 10px;
            }
            h1 {
              color: #1565C0;
              margin: 0;
              font-size: 24px;
            }
            .stt-number {
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              background-color: #1565C0;
              color: white;
              border-radius: 4px;
              font-size: 14px;
              margin-top: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #1565C0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
            }
            .info-table td {
              padding: 8px;
              vertical-align: top;
            }
            .info-table .label {
              font-weight: bold;
              width: 40%;
            }
            .addresses {
              display: flex;
              justify-content: space-between;
            }
            .address-box {
              width: 48%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .address-title {
              font-weight: bold;
              margin-bottom: 5px;
              color: #1565C0;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .barcode {
              text-align: center;
              margin: 20px 0;
            }
            .signature-area {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 45%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 40px;
              margin-bottom: 5px;
            }
            .total-price {
              font-size: 18px;
              font-weight: bold;
              color: #1565C0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SAMUDRA PAKET</h1>
              <div>Jasa Pengiriman Terpercaya</div>
            </div>
            
            <div class="section">
              <div class="stt-number">No. STT: ${stt.noSTT}</div>
              <div class="date">Tanggal: ${formatDate(stt.createdAt)}</div>
              <div class="status">${this.getStatusLabel(stt.status)}</div>
            </div>
            
            <div class="addresses">
              <div class="address-box">
                <div class="address-title">PENGIRIM:</div>
                <div>${stt.pengirim?.nama || 'N/A'}</div>
                <div>${stt.pengirim?.alamat || 'Alamat tidak tersedia'}</div>
                <div>${stt.pengirim?.telepon || ''}</div>
              </div>
              
              <div class="address-box">
                <div class="address-title">PENERIMA:</div>
                <div>${stt.penerima?.nama || 'N/A'}</div>
                <div>${stt.penerima?.alamat || 'Alamat tidak tersedia'}</div>
                <div>${stt.penerima?.telepon || ''}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">DETAIL PENGIRIMAN</div>
              <table class="info-table">
                <tr>
                  <td class="label">Cabang Asal</td>
                  <td>${stt.cabangAsal?.namaCabang || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Cabang Tujuan</td>
                  <td>${stt.cabangTujuan?.namaCabang || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Nama Barang</td>
                  <td>${stt.namaBarang}</td>
                </tr>
                <tr>
                  <td class="label">Komoditi</td>
                  <td>${stt.komoditi}</td>
                </tr>
                <tr>
                  <td class="label">Kemasan</td>
                  <td>${stt.packing}</td>
                </tr>
                <tr>
                  <td class="label">Jumlah Colly</td>
                  <td>${stt.jumlahColly} colly</td>
                </tr>
                <tr>
                  <td class="label">Berat</td>
                  <td>${stt.berat} kg</td>
                </tr>
                <tr>
                  <td class="label">Harga Per Kilo</td>
                  <td>${formatCurrency(stt.hargaPerKilo)}</td>
                </tr>
                <tr>
                  <td class="label">Total Biaya</td>
                  <td class="total-price">${formatCurrency(stt.harga)}</td>
                </tr>
                <tr>
                  <td class="label">Metode Pembayaran</td>
                  <td>${this.getPaymentTypeLabel(stt.paymentType)}</td>
                </tr>
                ${stt.keterangan ? `
                <tr>
                  <td class="label">Keterangan</td>
                  <td>${stt.keterangan}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div class="barcode">
              <div><strong>Scan untuk Pelacakan</strong></div>
              <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${stt.noSTT}&scale=3" />
            </div>
            
            <div class="signature-area">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Pengirim</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Petugas</div>
              </div>
            </div>
            
            <div class="footer">
              <p>PT Sarana Mudah Raya "Samudra" &copy; ${new Date().getFullYear()}</p>
              <p>Dokumen ini dicetak melalui aplikasi Samudra ERP</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate HTML for DMB (Daftar Muat Barang)
   * @param loading Loading data
   * @returns HTML string
   */
  public generateDMBHTML(loading: Loading): string {
    // Generate table rows for STTs
    let sttRows = '';
    if (loading.stts && loading.stts.length > 0) {
      loading.stts.forEach((stt, index) => {
        sttRows += `
          <tr>
            <td>${index + 1}</td>
            <td>${stt.noSTT}</td>
            <td>${stt.namaBarang}</td>
            <td>${stt.jumlahColly}</td>
            <td>${stt.berat}</td>
            <td>${stt.cabangTujuan?.namaCabang || 'N/A'}</td>
          </tr>
        `;
      });
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #1565C0;
              padding-bottom: 20px;
            }
            h1 {
              color: #1565C0;
              margin: 0;
              font-size: 24px;
            }
            .dmb-number {
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #1565C0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .info-table td {
              padding: 8px;
              vertical-align: top;
            }
            .info-table .label {
              font-weight: bold;
              width: 40%;
            }
            .stt-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #ddd;
            }
            .stt-table th, .stt-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .stt-table th {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .signature-area {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 30%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 40px;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DAFTAR MUAT BARANG</h1>
              <div>PT Sarana Mudah Raya "Samudra"</div>
            </div>
            
            <div class="section">
              <div class="dmb-number">No. Muat: ${loading.idMuat}</div>
              <div class="date">Tanggal: ${formatDate(loading.createdAt)}</div>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMASI KENDARAAN</div>
              <table class="info-table">
                <tr>
                  <td class="label">Kendaraan</td>
                  <td>${loading.antrianTruck?.truck?.namaKendaraan || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">No. Polisi</td>
                  <td>${loading.antrianTruck?.truck?.noPolisi || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Supir</td>
                  <td>${loading.antrianTruck?.supir?.nama || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Kenek</td>
                  <td>${loading.antrianTruck?.kenek?.nama || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Checker</td>
                  <td>${loading.checker?.nama || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <div class="section-title">RUTE</div>
              <table class="info-table">
                <tr>
                  <td class="label">Cabang Muat</td>
                  <td>${loading.cabangMuat?.namaCabang || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Cabang Bongkar</td>
                  <td>${loading.cabangBongkar?.namaCabang || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <div class="section-title">DAFTAR STT</div>
              <table class="stt-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>No. STT</th>
                    <th>Deskripsi Barang</th>
                    <th>Colly</th>
                    <th>Berat (kg)</th>
                    <th>Tujuan</th>
                  </tr>
                </thead>
                <tbody>
                  ${sttRows || '<tr><td colspan="6">Tidak ada data STT</td></tr>'}
                </tbody>
              </table>
            </div>
            
            <div class="signature-area">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Checker</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Supir</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Kepala Gudang</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Dicetak pada: ${formatDate(new Date().toISOString(), 'dd MMM yyyy HH:mm')}</p>
              <p>Dokumen ini dicetak melalui aplikasi Samudra ERP</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate HTML for Delivery Order
   * @param delivery Delivery data
   * @returns HTML string
   */
  public generateDeliveryOrderHTML(delivery: Delivery): string {
    // Generate table rows for STTs
    let sttRows = '';
    if (delivery.stts && delivery.stts.length > 0) {
      delivery.stts.forEach((stt, index) => {
        sttRows += `
          <tr>
            <td>${index + 1}</td>
            <td>${stt.noSTT}</td>
            <td>${stt.namaBarang}</td>
            <td>${stt.jumlahColly}</td>
            <td>${stt.berat}</td>
            <td>${stt.penerima?.nama || 'N/A'}</td>
            <td>${this.getPaymentTypeLabel(stt.paymentType)}</td>
          </tr>
        `;
      });
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #1565C0;
              padding-bottom: 20px;
            }
            h1 {
              color: #1565C0;
              margin: 0;
              font-size: 24px;
            }
            .delivery-number {
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #1565C0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .info-table td {
              padding: 8px;
              vertical-align: top;
            }
            .info-table .label {
              font-weight: bold;
              width: 40%;
            }
            .stt-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #ddd;
            }
            .stt-table th, .stt-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .stt-table th {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .signature-area {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 30%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 40px;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SURAT JALAN PENGIRIMAN</h1>
              <div>PT Sarana Mudah Raya "Samudra"</div>
            </div>
            
            <div class="section">
              <div class="delivery-number">No. Lansir: ${delivery.idLansir}</div>
              <div class="date">Tanggal: ${formatDate(delivery.berangkat)}</div>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMASI KENDARAAN</div>
              <table class="info-table">
                <tr>
                  <td class="label">Kendaraan</td>
                  <td>${delivery.antrianKendaraan?.kendaraan?.namaKendaraan || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">No. Polisi</td>
                  <td>${delivery.antrianKendaraan?.kendaraan?.noPolisi || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Supir</td>
                  <td>${delivery.antrianKendaraan?.supir?.nama || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Kenek</td>
                  <td>${delivery.antrianKendaraan?.kenek?.nama || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Checker</td>
                  <td>${delivery.checker?.nama || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMASI PENGIRIMAN</div>
              <table class="info-table">
                <tr>
                  <td class="label">Waktu Berangkat</td>
                  <td>${formatDate(delivery.berangkat, 'dd MMM yyyy HH:mm')}</td>
                </tr>
                ${delivery.estimasiLansir ? `
                <tr>
                  <td class="label">Estimasi Pengiriman</td>
                  <td>${delivery.estimasiLansir}</td>
                </tr>
                ` : ''}
                ${delivery.kilometerBerangkat ? `
                <tr>
                  <td class="label">KM Berangkat</td>
                  <td>${delivery.kilometerBerangkat} km</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div class="section">
              <div class="section-title">DAFTAR STT</div>
              <table class="stt-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>No. STT</th>
                    <th>Deskripsi Barang</th>
                    <th>Colly</th>
                    <th>Berat (kg)</th>
                    <th>Penerima</th>
                    <th>Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  ${sttRows || '<tr><td colspan="7">Tidak ada data STT</td></tr>'}
                </tbody>
              </table>
            </div>
            
            <div class="signature-area">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Checker</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Supir</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Admin</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Dicetak pada: ${formatDate(new Date().toISOString(), 'dd MMM yyyy HH:mm')}</p>
              <p>Dokumen ini dicetak melalui aplikasi Samudra ERP</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get human-readable label for payment type
   * @param paymentType Payment type code
   * @returns Human-readable payment type label
   */
  private getPaymentTypeLabel(paymentType: string): string {
    switch (paymentType) {
      case 'CASH':
        return 'Cash (Tunai)';
      case 'COD':
        return 'COD (Bayar di Tempat)';
      case 'CAD':
        return 'CAD (Bayar Setelah Kirim)';
      default:
        return paymentType || 'Unknown';
    }
  }

  /**
   * Get human-readable label for STT status
   * @param status STT status code
   * @returns Human-readable status label
   */
  private getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Menunggu';
      case 'PICKUP':
        return 'Pengambilan';
      case 'MUAT':
        return 'Muat';
      case 'TRANSIT':
        return 'Transit';
      case 'LANSIR':
        return 'Diantar';
      case 'TERKIRIM':
        return 'Terkirim';
      case 'RETURN':
        return 'Retur';
      default:
        return status || 'Unknown';
    }
  }
}

// Create a singleton instance
const printService = new PrintService();

export default printService;