import React from 'react';
import {
  FaCloudRain,
  FaBullhorn,
  FaBoxOpen,
  FaShoppingCart,
  FaTools,
  FaLeaf,
  FaTruck,
  FaUserShield,
  FaMoneyBillWave,
  FaChartLine
} from 'react-icons/fa';

const announcements = [
  <>
    <FaBullhorn style={{ verticalAlign: 'middle', marginRight: 6, color: '#D0021B' }} />
    <strong>Breaking News: Govt announces new guaranteed pricing for Maha season Keeri Samba and Nadu paddy crops!</strong>
  </>,
  <>
    <FaCloudRain style={{ verticalAlign: 'middle', marginRight: 6, color: '#4A90E2' }} />
    Weather Alert: Heavy rains expected tomorrow in the Central Highlands.
  </>,
  <>
    <FaBoxOpen style={{ verticalAlign: 'middle', marginRight: 6, color: '#7ED321' }} />
    Storage Update: New cold storage facility available at Dambulla Economic Centre.
  </>,
  <>
    <FaShoppingCart style={{ verticalAlign: 'middle', marginRight: 6, color: '#D0021B' }} />
    New Listings: 5 new organic Ceylon tea sellers added.
  </>,
  <>
    <FaTools style={{ verticalAlign: 'middle', marginRight: 6, color: '#BD10E0' }} />
    Platform Update: Sinhala and Tamil language support enhanced.
  </>,
  <>
    <FaLeaf style={{ verticalAlign: 'middle', marginRight: 6, color: '#28A745' }} />
    Agriculture News: Export-quality Cinnamon grading workshop in Galle next week.
  </>,
  <>
    <FaTruck style={{ verticalAlign: 'middle', marginRight: 6, color: '#FF6F00' }} />
    Logistics Update: New fresh produce routes established from Nuwara Eliya.
  </>,
  <>
    <FaUserShield style={{ verticalAlign: 'middle', marginRight: 6, color: '#007BFF' }} />
    Safety Alert: Updated safety guidelines for organic pesticide usage.
  </>,
  <>
    <FaMoneyBillWave style={{ verticalAlign: 'middle', marginRight: 6, color: '#FFC107' }} />
    Finance Update: Special low-interest loans announced for paddy farmers.
  </>,
  <>
    <FaChartLine style={{ verticalAlign: 'middle', marginRight: 6, color: '#17A2B8' }} />
    Market Trend: Demand for local organic spices rises sharply this quarter.
  </>
];

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div
        className="marquee"
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          animation: "marquee 60s linear infinite"
        }}
      >
        {announcements.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              color: "#ffffff",
              fontWeight: "bold",
              marginRight: "1rem"
            }}
          >
            {msg}
            <span style={{ margin: "0 1.5rem", color: "rgba(255,255,255,0.5)" }}>|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;

