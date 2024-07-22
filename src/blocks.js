import { Text, Spinner } from '@blockcode/ui';
import { connectDevice, downloadDevice, showDownloadScreen } from '@blockcode/device-pyboard';
import translations from './l10n.yaml';
import iconURI from './icon.png';

const deviceFilters = [
  {
    usbVendorId: 12346, // Espressif Vendor ID
  },
];

const downloadingAlert = (createAlert, removeAlert, progress) => {
  if (!downloadingAlert.id) {
    downloadingAlert.id = `download.${Date.now()}`;
  }
  if (progress < 100) {
    createAlert({
      id: downloadingAlert.id,
      icon: <Spinner level="success" />,
      message: (
        <Text
          id="blocks.alert.downloading"
          defaultMessage="Downloading...{progress}%"
          progress={progress}
        />
      ),
    });
  } else {
    createAlert({
      id: downloadingAlert.id,
      icon: null,
      message: (
        <Text
          id="blocks.alert.downloadCompleted"
          defaultMessage="Download completed."
        />
      ),
    });
    setTimeout(() => {
      removeAlert(downloadingAlert.id);
      delete downloadingAlert.id;
    }, 1000);
  }
};

export default {
  iconURI,
  name: (
    <Text
      id="extension.nes.name"
      defaultMessage="Broadcast"
    />
  ),
  blocks: [
    {
      button: 'DOWNLOAD_ROM',
      text: (
        <Text
          id="extension.nes.download"
          defaultMessage="Download ROM to Arcade"
        />
      ),
      async onClick({ context, createAlert, removeAlert }) {
        if (downloadingAlert.id) return;

        const { device, setDevice } = context;
        let currentDevice;
        try {
          currentDevice = device || (await connectDevice(deviceFilters, setDevice));
        } catch (err) {
          console.log(err);
        }
        if (!currentDevice) return;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.nes';
        fileInput.multiple = true;
        fileInput.click();
        fileInput.addEventListener('change', async ({ target }) => {
          const files = [];
          for (const file of target.files) {
            files.push({
              id: `nes/${file.name}`,
              content: await file.arrayBuffer(),
            });
          }

          try {
            await showDownloadScreen(currentDevice, 'arcade');
            downloadDevice(currentDevice, files, (progress) => downloadingAlert(createAlert, removeAlert, progress));
          } catch (err) {
            console.log(err);
          }
        });
      },
    },
  ],
  translations,
};
