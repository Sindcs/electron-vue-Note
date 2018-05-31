/**
 * Created by Sind on 2017/12/4.
 */
import { ipcRenderer, remote } from 'electron'
import renderutil from '../renderer/common/renderutil'
/* import dt from '../renderer/business/importAndExport/dt'
import evenote from '../renderer/business/importAndExport/evenote' */

ipcRenderer.on('analysisContentIndex-request', async (e, param) => {
  let paramInfo = param.data
  try {
    let content = renderutil.participleWord(paramInfo.content)
    remote.BrowserWindow.fromId(param.fromId).webContents.send(`analysisContentIndex-response-${paramInfo.cataLogId}`, {content: content})
  } catch (err) {
    console.log(err)
    remote.BrowserWindow.fromId(param.fromId).webContents.send(`analysisContentIndex-response-${paramInfo.cataLogId}`, {error: err})
  }
})
