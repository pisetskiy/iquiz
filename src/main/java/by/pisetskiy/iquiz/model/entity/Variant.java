package by.pisetskiy.iquiz.model.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
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
public class Variant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private Question question;
    private String value;
    private Boolean isTrue;
}
