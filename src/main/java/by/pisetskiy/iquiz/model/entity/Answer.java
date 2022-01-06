package by.pisetskiy.iquiz.model.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
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
public class Answer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    private Question question;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "answer_variant",
            joinColumns = @JoinColumn(name = "answer_id"),
            inverseJoinColumns = @JoinColumn(name = "variant_id"))
    @ToString.Exclude
    private Set<Variant> variants = new HashSet<>();

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime answerDate;

    private Boolean isTrue;
}
