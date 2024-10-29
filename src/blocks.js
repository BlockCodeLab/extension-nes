import { Text, Spinner } from '@blockcode/ui';
import { connectDevice, checkDevice, writeFiles, configDevice } from '@blockcode/device-pyboard';
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
      removeDownloading(removeAlert);
    }, 1000);
  }
};

const removeDownloading = (removeAlert) => {
  removeAlert(downloadingAlert.id);
  delete downloadingAlert.id;
};

const errorAlert = (createAlert, err) => {
  if (err === 'NotFoundError') return;
  createAlert(
    {
      message:
        err === 'NotFoundError' ? (
          <Text
            id="blocks.alert.connectionCancel"
            defaultMessage="Connection cancel."
          />
        ) : (
          <Text
            id="blocks.alert.connectionError"
            defaultMessage="Connection error."
          />
        ),
    },
    1000,
  );
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

        let currentDevice;
        try {
          currentDevice = await connectDevice(deviceFilters);
        } catch (err) {
          errorAlert(createAlert, err);
        }
        if (!currentDevice) return;

        const checker = checkDevice(currentDevice).catch(() => {
          errorAlert(createAlert);
          removeDownloading(removeAlert);
        });

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.nes';
        fileInput.multiple = true;
        fileInput.click();
        fileInput.addEventListener('change', async ({ target }) => {
          const files = [];
          let gameKey = '';
          for (const file of target.files) {
            files.push({
              id: `nes/${file.name}`,
              content: await file.arrayBuffer(),
            });
            gameKey = file.name;
          }

          try {
            await writeFiles(currentDevice, files, (progress) => downloadingAlert(createAlert, removeAlert, progress));
            await configDevice(currentDevice, {
              'latest-game': gameKey,
            });
            currentDevice.hardReset();
          } catch (err) {
            errorAlert(createAlert, err);
            removeDownloading(removeAlert);
          } finally {
            checker.cancel();
          }
        });
      },
    },
  ],
  translations,
};
