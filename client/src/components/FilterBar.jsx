function FilterBar({ filters, onChange, onReset }) {
  return (
    <section className="card filter-grid">
      <label>
        Language
        <input name="language" value={filters.language} onChange={onChange} placeholder="e.g., Spanish" />
      </label>

      <label>
        Category
        <input name="category" value={filters.category} onChange={onChange} placeholder="e.g., Food" />
      </label>

      <label>
        Proficiency
        <select name="proficiency" value={filters.proficiency} onChange={onChange}>
          <option value="">All</option>
          <option value="1">1 - New</option>
          <option value="2">2 - Learning</option>
          <option value="3">3 - Familiar</option>
          <option value="4">4 - Strong</option>
          <option value="5">5 - Mastered</option>
        </select>
      </label>

      <button type="button" onClick={onReset} className="secondary-button">
        Reset Filters
      </button>
    </section>
  );
}

export default FilterBar;
