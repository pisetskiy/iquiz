package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VariantRepository extends JpaRepository<Variant, Long> {
}
