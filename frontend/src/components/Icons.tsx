interface IconProps {
  size?: number;
  className?: string;
}

const icon = (path: string, viewBox = '0 0 24 24') =>
  ({ size = 20, className = '' }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path.split('|').map((d, i) => <path key={i} d={d} />)}
    </svg>
  );

export const HomeIcon = icon('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10');
export const PawIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="4.5" cy="9" r="2"/>
    <circle cx="9" cy="5.5" r="2"/>
    <circle cx="15" cy="5.5" r="2"/>
    <circle cx="19.5" cy="9" r="2"/>
    <path d="M12 10c-3.5 0-7 3-7 6.5 0 2.5 2 4.5 7 4.5s7-2 7-4.5c0-3.5-3.5-6.5-7-6.5z"/>
  </svg>
);
export const CalendarIcon = icon('M3 4h18v18H3z|M16 2v4|M8 2v4|M3 10h18');
export const ScissorsIcon = icon('M6 3a3 3 0 110 6 3 3 0 010-6z|M18 3a3 3 0 110 6 3 3 0 010-6z|M8.5 8.5L20 20|M3 20l9.7-9.7');
export const PackageIcon = icon('M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z|M3.27 6.96L12 12.01l8.73-5.05|M12 22.08V12');
export const UsersIcon = icon('M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 11a4 4 0 100-8 4 4 0 000 8z|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75');
export const MessageIcon = icon('M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z');
export const BellIcon = icon('M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 01-3.46 0');
export const LogOutIcon = icon('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4|M16 17l5-5-5-5|M21 12H9');
export const PlusIcon = icon('M12 5v14|M5 12h14');
export const EditIcon = icon('M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7|M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z');
export const TrashIcon = icon('M3 6h18|M8 6V4h8v2|M19 6l-1 14H6L5 6');
export const CheckIcon = icon('M20 6L9 17l-5-5');
export const XIcon = icon('M18 6L6 18|M6 6l12 12');
export const AlertIcon = icon('M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z|M12 9v4|M12 17h.01');
export const InfoIcon = icon('M12 22a10 10 0 100-20 10 10 0 000 20z|M12 8h.01|M12 12v4');
export const ArrowRightIcon = icon('M5 12h14|M12 5l7 7-7 7');
export const ArrowLeftIcon = icon('M19 12H5|M12 19l-7-7 7-7');
export const ChevronDownIcon = icon('M6 9l6 6 6-6');
export const ChevronRightIcon = icon('M9 18l6-6-6-6');
export const SearchIcon = icon('M11 19a8 8 0 100-16 8 8 0 000 16z|M21 21l-4.35-4.35');
export const FilterIcon = icon('M22 3H2l8 9.46V19l4 2v-8.54L22 3');
export const ClockIcon = icon('M12 22a10 10 0 100-20 10 10 0 000 20z|M12 6v6l4 2');
export const StarIcon = icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
export const ShieldIcon = icon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
export const BarChartIcon = icon('M18 20V10|M12 20V4|M6 20v-6');
export const TrendUpIcon = icon('M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6');
export const MenuIcon = icon('M3 12h18|M3 6h18|M3 18h18');
export const MapPinIcon = icon('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z|M12 10a1 1 0 100-2 1 1 0 000 2z');
export const PhoneIcon = icon('M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z');
export const MailIcon = icon('M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6');
export const EyeIcon = icon('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z');
export const RefreshIcon = icon('M23 4v6h-6|M1 20v-6h6|M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15');
export const SendIcon = icon('M22 2L11 13|M22 2L15 22l-4-9-9-4 20-7z');
export const UserIcon = icon('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 11a4 4 0 100-8 4 4 0 000 8z');
export const SettingsIcon = icon('M12 15a3 3 0 100-6 3 3 0 000 6z|M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z');
export const FileTextIcon = icon('M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6|M16 13H8|M16 17H8|M10 9H8');
export const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'AGENDADO') return <CalendarIcon size={14} />;
  if (status === 'EM_ANDAMENTO') return <RefreshIcon size={14} />;
  if (status === 'CONCLUIDO') return <CheckIcon size={14} />;
  if (status === 'CANCELADO') return <XIcon size={14} />;
  return null;
};
