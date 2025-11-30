import { useState } from 'react';
import { ModeToggle } from './ui/ModeToggle';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';
import { QRPreview } from './ui/QRPreview';
import { NoticeText } from './ui/NoticeText';
import { ErrorText } from './ui/ErrorText';

export function ComponentLibrary() {
  const [activeSection, setActiveSection] = useState<string>('all');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Navigation */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {['all', 'toggle', 'input', 'button', 'qr', 'text'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 border-2 border-black text-sm ${
              activeSection === section
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Component Sections */}
      <div className="space-y-12">
        {/* 1. Mode Toggle */}
        {(activeSection === 'all' || activeSection === 'toggle') && (
          <ComponentSection
            title="1. Toggle/WifiUrl"
            i18nKeys={['mode.wifi', 'mode.url']}
            description="2-state toggle switch for Wi-Fi and URL modes"
          >
            <div className="space-y-6">
              <StateDemo label="Interactive State">
                <ModeToggle />
              </StateDemo>
              
              <div className="grid md:grid-cols-2 gap-4">
                <StateDemo label="State: Wi-Fi Selected">
                  <ModeToggle defaultMode="wifi" disabled />
                </StateDemo>
                <StateDemo label="State: URL Selected">
                  <ModeToggle defaultMode="url" disabled />
                </StateDemo>
              </div>

              <SpecTable
                specs={[
                  { property: 'Width', value: '100% (flex-1 for each button)' },
                  { property: 'Height', value: 'py-3 (~48px)' },
                  { property: 'Border', value: '2px solid #000000' },
                  { property: 'Active BG', value: '#000000 (black)' },
                  { property: 'Active Text', value: '#FFFFFF (white)' },
                  { property: 'Inactive BG', value: '#FFFFFF (white)' },
                  { property: 'Inactive Text', value: '#000000 (black)' },
                ]}
              />
            </div>
          </ComponentSection>
        )}

        {/* 2. Text Input */}
        {(activeSection === 'all' || activeSection === 'input') && (
          <ComponentSection
            title="2. Input/Text"
            i18nKeys={['label.ssid', 'label.password', 'label.url', 'placeholder.ssid', 'placeholder.url']}
            description="Text input field with 3 states: Normal, Focus, Error"
          >
            <div className="space-y-6">
              <StateDemo label="State: Normal">
                <TextInput label="SSID" placeholder="Enter SSID" required />
              </StateDemo>

              <StateDemo label="State: Focus">
                <TextInput label="Password" placeholder="Enter password" autoFocus />
              </StateDemo>

              <StateDemo label="State: Error">
                <TextInput 
                  label="URL" 
                  placeholder="https://example.com" 
                  error="Invalid URL format"
                />
              </StateDemo>

              <StateDemo label="State: With Value">
                <TextInput 
                  label="SSID" 
                  placeholder="Enter SSID" 
                  value="OfficeWiFi"
                  required 
                />
              </StateDemo>

              <SpecTable
                specs={[
                  { property: 'Width', value: '100%' },
                  { property: 'Padding', value: '12px (p-3)' },
                  { property: 'Border (Normal)', value: '2px solid #000000' },
                  { property: 'Border (Focus)', value: '3px solid #000000' },
                  { property: 'Border (Error)', value: '2px solid #000000' },
                  { property: 'Font', value: 'system-ui, Segoe UI, Noto Sans JP' },
                  { property: 'Font Size', value: '14px' },
                  { property: 'Label Font Size', value: '14px (text-sm)' },
                ]}
              />
            </div>
          </ComponentSection>
        )}

        {/* 3. Primary Button */}
        {(activeSection === 'all' || activeSection === 'button') && (
          <ComponentSection
            title="3. Button/Primary"
            i18nKeys={['action.download', 'action.generate']}
            description="Primary action button for downloads and generation"
          >
            <div className="space-y-6">
              <StateDemo label="State: Normal">
                <PrimaryButton>Download PNG</PrimaryButton>
              </StateDemo>

              <StateDemo label="State: Hover (simulated)">
                <PrimaryButton className="!bg-white !text-black">
                  Download PNG
                </PrimaryButton>
              </StateDemo>

              <StateDemo label="State: Disabled">
                <PrimaryButton disabled>Download PNG</PrimaryButton>
              </StateDemo>

              <StateDemo label="Alternative Text">
                <PrimaryButton>Generate QR Code</PrimaryButton>
              </StateDemo>

              <SpecTable
                specs={[
                  { property: 'Width', value: '100%' },
                  { property: 'Padding', value: '16px vertical (py-4)' },
                  { property: 'Border', value: '2px solid #000000' },
                  { property: 'BG (Normal)', value: '#000000 (black)' },
                  { property: 'Text (Normal)', value: '#FFFFFF (white)' },
                  { property: 'BG (Hover)', value: '#FFFFFF (white)' },
                  { property: 'Text (Hover)', value: '#000000 (black)' },
                  { property: 'Disabled Opacity', value: '0.5' },
                ]}
              />
            </div>
          </ComponentSection>
        )}

        {/* 4. QR Preview */}
        {(activeSection === 'all' || activeSection === 'qr') && (
          <ComponentSection
            title="4. QRPreview"
            i18nKeys={['qr.preview', 'qr.scanning_instruction']}
            description="QR code preview container with responsive sizing"
          >
            <div className="space-y-6">
              <StateDemo label="State: Empty (Mobile Size)">
                <div className="max-w-md">
                  <QRPreview size="mobile" />
                </div>
              </StateDemo>

              <StateDemo label="State: Empty (Desktop Size)">
                <QRPreview size="desktop" />
              </StateDemo>

              <StateDemo label="State: With QR Code (Simulated)">
                <QRPreview size="desktop" hasQR />
              </StateDemo>

              <SpecTable
                specs={[
                  { property: 'Size (Mobile)', value: '256×256px' },
                  { property: 'Size (Desktop)', value: '320×320px' },
                  { property: 'Border', value: '2px solid #000000' },
                  { property: 'Background', value: '#FFFFFF (white)' },
                  { property: 'Padding', value: '24px (p-6)' },
                  { property: 'Alignment', value: 'Center (mx-auto)' },
                ]}
              />
            </div>
          </ComponentSection>
        )}

        {/* 5. Notice & Error Text */}
        {(activeSection === 'all' || activeSection === 'text') && (
          <ComponentSection
            title="5. NoticeText & ErrorText"
            i18nKeys={[
              'notice.wifi',
              'notice.url',
              'notice.security',
              'error.ssid_required',
              'error.invalid_url',
            ]}
            description="Informational and error message text components"
          >
            <div className="space-y-6">
              <StateDemo label="NoticeText: Wi-Fi Mode">
                <NoticeText>
                  SSID is required. Password is optional for open networks.
                </NoticeText>
              </StateDemo>

              <StateDemo label="NoticeText: URL Mode">
                <NoticeText>
                  Include https:// in your URL. It will be added automatically if missing.
                </NoticeText>
              </StateDemo>

              <StateDemo label="NoticeText: Security Info">
                <NoticeText>
                  All QR generation happens in your browser. No data is sent to servers.
                </NoticeText>
              </StateDemo>

              <StateDemo label="ErrorText: SSID Required">
                <ErrorText>SSID is required</ErrorText>
              </StateDemo>

              <StateDemo label="ErrorText: Invalid URL">
                <ErrorText>Invalid URL format</ErrorText>
              </StateDemo>

              <SpecTable
                specs={[
                  { property: 'Font Size', value: '12px (text-xs)' },
                  { property: 'Color', value: '#000000 (black)' },
                  { property: 'Notice Opacity', value: '0.7' },
                  { property: 'Notice Icon', value: 'ⓘ prefix' },
                  { property: 'Error Style', value: 'font-bold' },
                  { property: 'Error Icon', value: '⚠ prefix' },
                ]}
              />
            </div>
          </ComponentSection>
        )}
      </div>

      {/* i18n Key Reference */}
      <div className="mt-12 p-6 border-2 border-black">
        <h2 className="text-black mb-4">🌐 i18next Key Reference</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-black mb-2 font-bold">Mode & Labels</h3>
            <KeyTable
              keys={[
                { key: 'mode.wifi', ja: 'Wi-Fi', en: 'Wi-Fi' },
                { key: 'mode.url', ja: 'URL', en: 'URL' },
                { key: 'label.ssid', ja: 'SSID', en: 'SSID' },
                { key: 'label.password', ja: 'パスワード', en: 'Password' },
                { key: 'label.url', ja: 'URL', en: 'URL' },
              ]}
            />
          </div>
          <div>
            <h3 className="text-black mb-2 font-bold">Actions</h3>
            <KeyTable
              keys={[
                { key: 'action.download', ja: 'PNGダウンロード', en: 'Download PNG' },
                { key: 'action.generate', ja: 'QRコード生成', en: 'Generate QR Code' },
              ]}
            />
          </div>
          <div>
            <h3 className="text-black mb-2 font-bold">Notices</h3>
            <KeyTable
              keys={[
                { 
                  key: 'notice.wifi', 
                  ja: 'SSIDは必須です。パスワードはオープンネットワークの場合は省略可能です。', 
                  en: 'SSID is required. Password is optional for open networks.' 
                },
                { 
                  key: 'notice.url', 
                  ja: 'URLにhttps://を含めてください。省略時は自動で追加されます。', 
                  en: 'Include https:// in your URL. It will be added automatically if missing.' 
                },
                { 
                  key: 'notice.security', 
                  ja: 'すべてのQR生成はブラウザ内で行われます。データはサーバーに送信されません。', 
                  en: 'All QR generation happens in your browser. No data is sent to servers.' 
                },
              ]}
            />
          </div>
          <div>
            <h3 className="text-black mb-2 font-bold">Errors</h3>
            <KeyTable
              keys={[
                { key: 'error.ssid_required', ja: 'SSIDは必須です', en: 'SSID is required' },
                { key: 'error.invalid_url', ja: '無効なURL形式です', en: 'Invalid URL format' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Next Phase Instruction */}
      <div className="mt-12 p-6 border-4 border-black bg-black text-white">
        <h2 className="mb-4">📝 Next Action</h2>
        <p className="text-lg">
          <strong>Phase 3 プロンプトを最新状況で調整する</strong>
        </p>
        <p className="text-sm mt-2 opacity-90">
          コンポーネント定義が完了しました。次はビジュアルデザインフェーズへ移行します。
          タイポグラフィ、スペーシング、アクセシビリティ（コントラスト比4.5:1以上）を最終調整します。
        </p>
      </div>
    </div>
  );
}

// Helper Components
function ComponentSection({ 
  title, 
  i18nKeys, 
  description, 
  children 
}: { 
  title: string; 
  i18nKeys: string[]; 
  description: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="border-4 border-black p-6">
      <div className="mb-4 pb-4 border-b-2 border-black">
        <h2 className="text-black text-xl mb-2">{title}</h2>
        <p className="text-black text-sm mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {i18nKeys.map((key) => (
            <code 
              key={key} 
              className="text-xs bg-white border border-black px-2 py-1"
            >
              {key}
            </code>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

function StateDemo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-black p-4">
      <div className="text-xs text-black mb-3 font-bold">{label}</div>
      {children}
    </div>
  );
}

function SpecTable({ specs }: { specs: { property: string; value: string }[] }) {
  return (
    <div className="border-2 border-black">
      <div className="bg-black text-white px-3 py-2 text-sm font-bold">
        Specifications
      </div>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, index) => (
            <tr 
              key={spec.property} 
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-3 py-2 border-r border-black font-bold">
                {spec.property}
              </td>
              <td className="px-3 py-2">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KeyTable({ keys }: { keys: { key: string; ja: string; en: string }[] }) {
  return (
    <div className="border border-black text-xs">
      <table className="w-full">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-2 py-1 text-left">Key</th>
            <th className="px-2 py-1 text-left">JA</th>
            <th className="px-2 py-1 text-left">EN</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((item, index) => (
            <tr 
              key={item.key}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-2 py-1 border-t border-black">
                <code className="text-xs">{item.key}</code>
              </td>
              <td className="px-2 py-1 border-t border-black">{item.ja}</td>
              <td className="px-2 py-1 border-t border-black">{item.en}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
