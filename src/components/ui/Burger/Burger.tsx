type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export default function Burger({ isOpen, onClick }: Props) {
  return (
    <button
      className={`burger ${isOpen ? "active" : ""}`}
      aria-label="Меню"
      onClick={onClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}
