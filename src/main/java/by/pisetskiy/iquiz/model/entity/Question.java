package by.pisetskiy.iquiz.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Question extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Quiz quiz;

    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private QuestionType type;
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = Boolean.TRUE;
    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<Variant> variants = new ArrayList<>();

    public void addVariants(List<Variant> variants) {
        this.variants.addAll(variants);
        variants.forEach(variant -> variant.setQuestion(this));
    }

    public void removeVariants(List<Variant> variants) {
        this.variants.removeAll(variants);
        variants.forEach(variant -> variant.setQuestion(null));
    }
}
